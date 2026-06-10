"use client"

import { useEffect, useRef, type FormEvent } from "react"
import { BrandMark } from "@/components/brand-mark"
import { StreamingAnswer } from "@/components/streaming-answer"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { confidenceLabels, type DraftConversation, type ChatTurn, type ServerState } from "@/lib/app-types"
import { ArrowUp, BookOpen, FileSearch, Menu, PanelRightOpen, ShieldQuestion, Sparkles } from "lucide-react"

const confidenceStyles: Record<string, string> = {
  high: "bg-accent text-accent-foreground",
  medium: "bg-secondary text-secondary-foreground",
  low: "bg-muted text-muted-foreground",
  not_found: "bg-muted text-muted-foreground",
}

const suggestions = [
  "নামাজের সঠিক নিয়ম কী?",
  "যাকাত কাদের উপর ফরজ?",
  "রোজা ভঙ্গের কারণগুলো কী কী?",
]

const serverLabel: Record<ServerState, string> = {
  checking: "সংযোগ যাচাই হচ্ছে",
  online: "সার্ভার সক্রিয়",
  offline: "সার্ভার বন্ধ",
}

const serverDot: Record<ServerState, string> = {
  checking: "bg-warning",
  online: "bg-primary",
  offline: "bg-destructive",
}

export function ChatMain({
  conversation,
  selectedTurnId,
  streamingTurnId,
  isAsking,
  pendingQuestion,
  chatError,
  query,
  serverState,
  onQueryChange,
  onSubmit,
  onSelectTurn,
  onStreamDone,
  onOpenMobileMenu,
  onOpenSources,
}: {
  conversation: DraftConversation | undefined
  selectedTurnId: string | null
  streamingTurnId: string | null
  isAsking: boolean
  pendingQuestion: string
  chatError: string
  query: string
  serverState: ServerState
  onQueryChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSelectTurn: (id: string) => void
  onStreamDone: () => void
  onOpenMobileMenu: () => void
  onOpenSources: () => void
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const turns = conversation?.turns ?? []
  const hasMessages = turns.length > 0 || Boolean(pendingQuestion)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [pendingQuestion, turns.length, isAsking])

  function handleSuggestion(text: string) {
    onQueryChange(text)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <header className="shrink-0 flex items-center justify-between gap-3 border-b border-border bg-card/60 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
            aria-label="মেনু খুলুন"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Chat</p>
            <h1 className="truncate font-heading text-base font-bold leading-tight md:text-lg">
              {conversation?.title || "নতুন আলোচনা"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
            <span className={cn("size-2 rounded-full", serverDot[serverState])} />
            {serverLabel[serverState]}
          </span>
          <button
            type="button"
            onClick={onOpenSources}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground xl:hidden"
            aria-label="তথ্যসূত্র দেখুন"
          >
            <PanelRightOpen className="size-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-6 md:px-6">
        {!hasMessages ? (
          <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
            <BrandMark size={68} />
            <h2 className="mt-5 text-balance font-heading text-2xl font-bold md:text-3xl">
              কী জানতে চান?
            </h2>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              বাংলা বা ইংরেজিতে প্রশ্ন করুন। প্রতিটি উত্তরের সাথে নির্ভরযোগ্য
              তথ্যসূত্র দেখানো হবে।
            </p>

            <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-1">
              {suggestions.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => handleSuggestion(text)}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition hover:border-primary/40 hover:bg-accent/40"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <span className="flex-1 font-medium text-foreground">{text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            {turns.map((turn) => (
              <TurnBlock
                key={turn.id}
                turn={turn}
                isSelected={selectedTurnId === turn.id}
                isStreaming={streamingTurnId === turn.id}
                onSelect={() => onSelectTurn(turn.id)}
                onStreamDone={onStreamDone}
              />
            ))}

            {pendingQuestion ? <UserQuestionBubble question={pendingQuestion} /> : null}

            {isAsking ? (
              <div className="animate-fade-rise flex items-start gap-3">
                <BrandMark size={36} />
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                  চিন্তা করছি
                  <span className="flex items-center gap-1" aria-hidden="true">
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 z-20 shrink-0 border-t border-border bg-gradient-to-b from-background to-card/30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 md:px-6">
        <form onSubmit={onSubmit} className="mx-auto max-w-3xl">
          {chatError ? (
            <p className="mb-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {chatError}
            </p>
          ) : null}

          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <textarea
              dir="auto"
              rows={1}
              maxLength={500}
              minLength={5}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="আপনার প্রশ্ন লিখুন..."
              className="max-h-40 min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isAsking || serverState === "offline" || query.trim().length < 5}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="প্রশ্ন পাঠান"
            >
              <ArrowUp className="size-5" />
            </button>
          </div>
          <p className="mt-2 px-1 text-center text-xs text-muted-foreground">
            Fatwa Chat Bot ভুল করতে পারে — গুরুত্বপূর্ণ বিষয়ে আলেমের পরামর্শ নিন।
          </p>
        </form>
      </div>
    </section>
  )
}

function UserQuestionBubble({ question }: { question: string }) {
  return (
    <div className="flex justify-end">
      <div
        dir="auto"
        className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm"
      >
        {question}
      </div>
    </div>
  )
}

function TurnBlock({
  turn,
  isSelected,
  isStreaming,
  onSelect,
  onStreamDone,
}: {
  turn: ChatTurn
  isSelected: boolean
  isStreaming: boolean
  onSelect: () => void
  onStreamDone: () => void
}) {
  return (
    <article className="animate-fade-rise space-y-4">
      {/* User question */}
      <UserQuestionBubble question={turn.question} />

      {/* Assistant answer */}
      <div className="flex items-start gap-3">
        <BrandMark size={36} />
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "gap-1.5 border-0 text-xs font-medium",
                confidenceStyles[turn.response.confidence],
              )}
            >
              <ShieldQuestion className="size-3.5" />
              {confidenceLabels[turn.response.confidence]}
            </Badge>
            {turn.response.madhabs?.length ? (
              <Badge variant="secondary" className="gap-1.5 font-normal">
                <BookOpen className="size-3.5 text-primary" />
                {turn.response.madhabs.join(", ")}
              </Badge>
            ) : null}
            <button
              type="button"
              onClick={onSelect}
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition",
                isSelected
                  ? "bg-accent text-accent-foreground"
                  : "text-primary hover:bg-accent/60",
              )}
            >
              <FileSearch className="size-3.5" />
              {turn.response.sources.length} টি উৎস
            </button>
          </div>

          <StreamingAnswer
            shouldStream={isStreaming}
            text={turn.response.answer}
            onDone={onStreamDone}
          />
        </div>
      </div>
    </article>
  )
}
