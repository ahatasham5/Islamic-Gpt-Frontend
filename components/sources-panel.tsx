import { Badge } from "@/components/ui/badge"
import { type ChatTurn } from "@/lib/app-types"
import type { Source } from "@/lib/types"
import { FileText, Languages, Layers, Library, ScrollText, Sparkles, X } from "lucide-react"

export function SourcesPanel({
  selectedTurn,
  onViewThinking,
  onClose,
}: {
  selectedTurn: ChatTurn | null
  onViewThinking: (source: Source) => void
  onClose?: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-card">
      {/* Header */}
      <header className="flex h-14 sm:h-16 lg:h-[72px] shrink-0 items-center justify-between gap-2 sm:gap-2.5 border-b border-border px-3 sm:px-4 lg:px-5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="inline-flex size-7 sm:size-8 items-center justify-center rounded-lg bg-accent text-primary">
            <Library className="size-4 sm:size-5" />
          </span>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-primary">
              Evidence
            </p>
            <h2 className="font-heading text-sm sm:text-base font-bold leading-tight">তথ্যসূত্র</h2>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-7 sm:size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="বন্ধ করুন"
          >
            <X className="size-4 sm:size-5" />
          </button>
        )}
      </header>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-3 lg:p-4">
        {selectedTurn ? (
          <div className="space-y-3 sm:space-y-4">
            {/* Context summary */}
            <div className="rounded-xl border border-border bg-secondary/50 p-3 sm:p-3.5">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge variant="secondary" className="gap-1 sm:gap-1.5 bg-card font-normal text-xs">
                  <Layers className="size-3 sm:size-3.5 text-primary" />
                  {selectedTurn.response.total_chunks_retrieved} chunks
                </Badge>
                <Badge variant="secondary" className="gap-1 sm:gap-1.5 bg-card font-normal text-xs">
                  <Languages className="size-3 sm:size-3.5 text-primary" />
                  {selectedTurn.response.query_language === "bn" ? "বাংলা" : "English"}
                </Badge>
              </div>
              {selectedTurn.response.arabic_translation && (
                <p
                  dir="rtl"
                  className="mt-2.5 sm:mt-3 border-t border-border pt-2.5 sm:pt-3 text-right text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose text-foreground"
                  lang="ar"
                >
                  {selectedTurn.response.arabic_translation}
                </p>
              )}
            </div>

            {/* Sources list */}
            <div className="space-y-2 sm:space-y-3">
              {selectedTurn.response.sources.map((source, index) => (
                <article
                  key={`${source.file_name}-${index}`}
                  className="rounded-xl border border-border bg-card p-3 sm:p-3.5 transition hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-1.5 sm:gap-2">
                      <span className="mt-0.5 inline-flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                        <ScrollText className="size-3.5 sm:size-4" />
                      </span>
                      <strong
                        dir="auto"
                        className="text-xs sm:text-sm font-semibold leading-snug text-foreground"
                      >
                        {source.book_title}
                      </strong>
                    </div>
                    {source.madhab && (
                      <span className="shrink-0 text-[10px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap mt-0.5">
                        মাযহাব: {source.madhab}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewThinking(source)}
                    className="mt-2.5 sm:mt-3 flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-primary/40 bg-accent/40 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary transition hover:bg-accent"
                  >
                    <FileText className="size-3.5 sm:size-4" />
                    মূল অংশ দেখুন
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-4 sm:px-6 text-center">
            <span className="inline-flex size-10 sm:size-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Sparkles className="size-5 sm:size-6" />
            </span>
            <p className="mt-3 sm:mt-4 text-sm font-medium text-foreground">
              এখনো কোনো তথ্যসূত্র নেই
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              প্রশ্ন করলে এখানে প্রাসঙ্গিক উৎস ও রেফারেন্স দেখানো হবে।
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
