import { type ChangeEvent, type FormEvent, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useBooks } from "@/hooks/use-books"
import { useChat } from "@/hooks/use-chat"
import { useHealth } from "@/hooks/use-health"
import { useAuthContext } from "@/lib/auth-context"
import type { DraftConversation, ViewMode } from "@/lib/app-types"
import { createId } from "@/lib/format"
import type { BookInfo, Source } from "@/lib/types"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMain } from "@/components/chat-main"
import { SourcesPanel } from "@/components/sources-panel"
import { BookManager } from "@/components/book-manager"
import { CreateMuftiPanel } from "@/components/create-mufti-panel"
import { ThinkingModal } from "@/components/thinking-modal"
import { Sheet, SheetContent } from "@/components/ui/sheet"

const initialConversations: DraftConversation[] = [
  {
    id: "local-new",
    title: "New conversation",
    turns: [],
    createdAt: new Date().toISOString(),
  },
]

export function ChatApp() {
  const { session, logout } = useAuthContext()
  const router = useRouter()

  const canManageBooks = session?.user.role === "super_admin"
  const health = useHealth(Boolean(session))
  const chat = useChat()
  const bookState = useBooks(Boolean(session && canManageBooks))

  const [conversations, setConversations] = useState<DraftConversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id)
  const [query, setQuery] = useState("")
  const [pendingTurn, setPendingTurn] = useState<{ conversationId: string; question: string } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("chat")
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null)
  const [thinkingSource, setThinkingSource] = useState<Source | null>(null)
  const [streamingTurnId, setStreamingTurnId] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileSourcesOpen, setMobileSourcesOpen] = useState(false)

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? conversations[0],
    [activeConversationId, conversations],
  )

  const selectedTurn = useMemo(() => {
    const allTurns = activeConversation?.turns ?? []
    if (selectedTurnId) {
      return allTurns.find((t) => t.id === selectedTurnId) ?? allTurns.at(-1) ?? null
    }
    return allTurns.at(-1) ?? null
  }, [activeConversation, selectedTurnId])

  function handleLogout() {
    logout()
    router.replace("/login")
  }

  function handleNewChat() {
    const conversation: DraftConversation = {
      id: createId("chat"),
      title: "New conversation",
      turns: [],
      createdAt: new Date().toISOString(),
    }
    setConversations((current) => [conversation, ...current])
    setActiveConversationId(conversation.id)
    setSelectedTurnId(null)
    setThinkingSource(null)
    setPendingTurn(null)
    setViewMode("chat")
    setMobileNavOpen(false)
  }

  function handleSelectConversation(id: string) {
    const conversation = conversations.find((c) => c.id === id)
    setActiveConversationId(id)
    setSelectedTurnId(conversation?.turns.at(-1)?.id ?? null)
    setThinkingSource(null)
    setViewMode("chat")
    setMobileNavOpen(false)
  }

  function handleOpenBooks() {
    setViewMode("books")
    setMobileNavOpen(false)
  }

  function handleOpenMuftiManagement() {
    setViewMode("mufti-management")
    setMobileNavOpen(false)
  }

  async function handleAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    chat.setChatError("")
    setThinkingSource(null)

    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 5) {
      chat.setChatError("Question must be at least 5 characters.")
      return
    }

    const targetConversationId = activeConversationId
    setPendingTurn({ conversationId: targetConversationId, question: trimmedQuery })
    setQuery("")

    try {
      const response = await chat.ask({
        query: trimmedQuery,
        book_id: null,
        top_k: 5,
      })
      const turn = {
        id: createId("turn"),
        question: trimmedQuery,
        response,
        createdAt: new Date().toISOString(),
      }

      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== targetConversationId) return conversation
          return {
            ...conversation,
            title: conversation.turns.length === 0 ? trimmedQuery.slice(0, 44) : conversation.title,
            turns: [...conversation.turns, turn],
          }
        }),
      )
      setSelectedTurnId(turn.id)
      setStreamingTurnId(turn.id)
    } catch {
      setQuery(trimmedQuery)
    } finally {
      setPendingTurn(null)
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!canManageBooks) {
      bookState.setUploadMessage("This account does not have permission to manage books.")
      return
    }
    if (!file) return
    if (!file.name.endsWith(".md")) {
      bookState.setUploadMessage("Only .md files can be uploaded.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    await bookState.uploadBook(formData)
  }

  async function handleDelete(book: BookInfo) {
    if (!canManageBooks) {
      bookState.setUploadMessage("This account does not have permission to manage books.")
      return
    }

    const confirmed = window.confirm(`Delete "${book.book_title || book.file_name}"?`)
    if (!confirmed) return

    await bookState.deleteBook(book)
  }

  if (!session) return null

  const sidebar = (onCloseMobile?: () => void) => (
    <ChatSidebar
      session={session}
      conversations={conversations}
      activeConversationId={activeConversationId}
      viewMode={viewMode}
      canManageBooks={Boolean(canManageBooks)}
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      onOpenBooks={handleOpenBooks}
      onOpenMuftiManagement={handleOpenMuftiManagement}
      onLogout={handleLogout}
      onCloseMobile={onCloseMobile}
    />
  )

  return (
    <div className="grid h-dvh min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_340px]">
      <aside className="hidden min-h-0 overflow-hidden border-r border-sidebar-border lg:block">
        {sidebar()}
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="h-dvh w-[300px] overflow-hidden p-0">
          {sidebar(() => setMobileNavOpen(false))}
        </SheetContent>
      </Sheet>

      {viewMode === "books" && canManageBooks ? (
        <BookManager
          books={bookState.books}
          isLoadingBooks={bookState.isLoadingBooks}
          uploadMessage={bookState.uploadMessage}
          isUploading={bookState.isUploading}
          deletingBookId={bookState.deletingBookId}
          onUpload={handleUpload}
          onDelete={handleDelete}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />
      ) : viewMode === "mufti-management" && session.user.role === "super_admin" ? (
        <CreateMuftiPanel onOpenMobileMenu={() => setMobileNavOpen(true)} />
      ) : (
        <ChatMain
          conversation={activeConversation}
          selectedTurnId={selectedTurnId}
          streamingTurnId={streamingTurnId}
          isAsking={chat.isAsking}
          pendingQuestion={
            pendingTurn?.conversationId === activeConversationId ? pendingTurn.question : ""
          }
          chatError={chat.chatError}
          query={query}
          serverState={health.serverState}
          onQueryChange={setQuery}
          onSubmit={handleAsk}
          onSelectTurn={(id) => {
            setSelectedTurnId(id)
            setMobileSourcesOpen(true)
          }}
          onStreamDone={() => setStreamingTurnId(null)}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
          onOpenSources={() => setMobileSourcesOpen(true)}
        />
      )}

      {viewMode === "chat" ? (
        <aside className="hidden min-h-0 overflow-hidden border-l border-border xl:block">
          <SourcesPanel selectedTurn={selectedTurn} onViewThinking={setThinkingSource} />
        </aside>
      ) : null}
      <Sheet open={mobileSourcesOpen} onOpenChange={setMobileSourcesOpen}>
        <SheetContent side="right" className="h-dvh w-[340px] max-w-[88vw] overflow-hidden p-0">
          <SourcesPanel selectedTurn={selectedTurn} onViewThinking={setThinkingSource} />
        </SheetContent>
      </Sheet>

      <ThinkingModal source={thinkingSource} onClose={() => setThinkingSource(null)} />
    </div>
  )
}
