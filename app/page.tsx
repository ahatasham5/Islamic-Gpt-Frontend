"use client"

import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { api, getApiErrorMessage } from "@/lib/http"
import type {
  BookInfo,
  BookListResponse,
  BookUploadResponse,
  ChatResponse,
  HealthResponse,
  Source,
} from "@/lib/types"
import type { DraftConversation, MockSession, ServerState, ViewMode } from "@/lib/app-types"
import { createId } from "@/lib/format"
import { LoginScreen } from "@/components/login-screen"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMain } from "@/components/chat-main"
import { SourcesPanel } from "@/components/sources-panel"
import { BookManager } from "@/components/book-manager"
import { ThinkingModal } from "@/components/thinking-modal"
import { Sheet, SheetContent } from "@/components/ui/sheet"

const initialConversations: DraftConversation[] = [
  {
    id: "local-new",
    title: "নতুন আলোচনা",
    turns: [],
    createdAt: new Date().toISOString(),
  },
]

export default function Home() {
  const [session, setSession] = useState<MockSession | null>(null)
  const [serverState, setServerState] = useState<ServerState>("checking")
  const [books, setBooks] = useState<BookInfo[]>([])
  const [conversations, setConversations] = useState<DraftConversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id)
  const [query, setQuery] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [pendingTurn, setPendingTurn] = useState<{ conversationId: string; question: string } | null>(null)
  const [chatError, setChatError] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("chat")
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null)
  const [thinkingSource, setThinkingSource] = useState<Source | null>(null)
  const [streamingTurnId, setStreamingTurnId] = useState<string | null>(null)
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileSourcesOpen, setMobileSourcesOpen] = useState(false)

  const canManageBooks = session?.role === "book_manager"
  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0],
    [activeConversationId, conversations],
  )
  const selectedTurn = useMemo(() => {
    const allTurns = activeConversation?.turns ?? []
    if (selectedTurnId) {
      return allTurns.find((turn) => turn.id === selectedTurnId) ?? allTurns.at(-1) ?? null
    }
    return allTurns.at(-1) ?? null
  }, [activeConversation, selectedTurnId])

  const loadHealth = useCallback(async () => {
    try {
      await api.get<HealthResponse>("/health")
      setServerState("online")
    } catch {
      setServerState("offline")
    }
  }, [])

  const loadBooks = useCallback(async () => {
    setIsLoadingBooks(true)
    try {
      const response = await api.get<BookListResponse>("/books")
      setBooks(response.data.books)
    } catch (error) {
      setUploadMessage(getApiErrorMessage(error))
    } finally {
      setIsLoadingBooks(false)
    }
  }, [])

  useEffect(() => {
    if (!session) return
    loadHealth()
    loadBooks()
  }, [session, loadBooks, loadHealth])

  function handleLogin(next: MockSession) {
    setSession(next)
    setViewMode("chat")
  }

  function handleLogout() {
    setSession(null)
    setViewMode("chat")
    setThinkingSource(null)
    setPendingTurn(null)
    setMobileNavOpen(false)
  }

  function handleNewChat() {
    const conversation: DraftConversation = {
      id: createId("chat"),
      title: "নতুন আলোচনা",
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

  async function handleAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChatError("")
    setThinkingSource(null)

    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 5) {
      setChatError("প্রশ্ন অন্তত ৫ অক্ষরের হতে হবে।")
      return
    }

    setIsAsking(true)
    const targetConversationId = activeConversationId
    setPendingTurn({ conversationId: targetConversationId, question: trimmedQuery })
    setQuery("")
    try {
      const response = await api.post<ChatResponse>("/chat", {
        query: trimmedQuery,
        book_id: null,
        top_k: 5,
      })
      const turn = {
        id: createId("turn"),
        question: trimmedQuery,
        response: response.data,
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
    } catch (error) {
      setChatError(getApiErrorMessage(error))
      setQuery(trimmedQuery)
    } finally {
      setIsAsking(false)
      setPendingTurn(null)
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!canManageBooks) {
      setUploadMessage("এই অ্যাকাউন্টে কিতাব ম্যানেজ করার অনুমতি নেই।")
      return
    }
    if (!file) return
    if (!file.name.endsWith(".md")) {
      setUploadMessage("শুধু .md ফাইল আপলোড করা যাবে।")
      return
    }

    setIsUploading(true)
    setUploadMessage("")
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await api.post<BookUploadResponse>("/books/upload", formData)
      setUploadMessage(response.data.message)
      await loadBooks()
    } catch (error) {
      setUploadMessage(getApiErrorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete(book: BookInfo) {
    if (!canManageBooks) {
      setUploadMessage("এই অ্যাকাউন্টে কিতাব ম্যানেজ করার অনুমতি নেই।")
      return
    }
    const confirmed = window.confirm(`"${book.book_title || book.file_name}" মুছে ফেলবেন?`)
    if (!confirmed) return

    setDeletingBookId(book.book_id)
    setUploadMessage("")
    try {
      await api.delete(`/books/${book.book_id}`)
      await loadBooks()
    } catch (error) {
      setUploadMessage(getApiErrorMessage(error))
    } finally {
      setDeletingBookId(null)
    }
  }

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const sidebar = (onCloseMobile?: () => void) => (
    <ChatSidebar
      session={session}
      conversations={conversations}
      activeConversationId={activeConversationId}
      viewMode={viewMode}
      canManageBooks={canManageBooks}
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      onOpenBooks={handleOpenBooks}
      onLogout={handleLogout}
      onCloseMobile={onCloseMobile}
    />
  )

  return (
    <div className="grid h-dvh min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_340px]">
      {/* Desktop sidebar */}
      <aside className="hidden min-h-0 overflow-hidden border-r border-sidebar-border lg:block">{sidebar()}</aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="h-dvh w-[300px] overflow-hidden p-0">
          {sidebar(() => setMobileNavOpen(false))}
        </SheetContent>
      </Sheet>

      {/* Main */}
      {viewMode === "books" && canManageBooks ? (
        <BookManager
          books={books}
          isLoadingBooks={isLoadingBooks}
          uploadMessage={uploadMessage}
          isUploading={isUploading}
          deletingBookId={deletingBookId}
          onUpload={handleUpload}
          onDelete={handleDelete}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />
      ) : (
        <ChatMain
          conversation={activeConversation}
          selectedTurnId={selectedTurnId}
          streamingTurnId={streamingTurnId}
          isAsking={isAsking}
          pendingQuestion={pendingTurn?.conversationId === activeConversationId ? pendingTurn.question : ""}
          chatError={chatError}
          query={query}
          serverState={serverState}
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

      {/* Desktop sources panel (chat view only) */}
      {viewMode === "chat" ? (
        <aside className="hidden min-h-0 overflow-hidden border-l border-border xl:block">
          <SourcesPanel selectedTurn={selectedTurn} onViewThinking={setThinkingSource} />
        </aside>
      ) : null}

      {/* Mobile/tablet sources */}
      <Sheet open={mobileSourcesOpen} onOpenChange={setMobileSourcesOpen}>
        <SheetContent side="right" className="h-dvh w-[340px] max-w-[88vw] overflow-hidden p-0">
          <SourcesPanel selectedTurn={selectedTurn} onViewThinking={setThinkingSource} />
        </SheetContent>
      </Sheet>

      <ThinkingModal source={thinkingSource} onClose={() => setThinkingSource(null)} />
    </div>
  )
}
