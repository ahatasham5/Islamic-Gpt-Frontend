import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { percent, renderFormattedAnswer } from "@/lib/format"
import type { Source } from "@/lib/types"
import { FileText, Hash } from "lucide-react"

export function ThinkingModal({
  source,
  onClose,
}: {
  source: Source | null
  onClose: () => void
}) {
  return (
    <Dialog open={Boolean(source)} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {source ? (
          <>
            <DialogHeader className="space-y-2 border-b border-border p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                মূল অংশ
              </p>
              <DialogTitle dir="auto" className="font-heading text-lg leading-snug">
                {source.book_title}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 pt-1">
                {/^https?:\/\//i.test(source.file_name) ? (
                  <a
                    href={source.file_name}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors max-w-[260px] truncate dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400 dark:hover:text-blue-200"
                    title={source.file_name}
                  >
                    <svg className="size-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Visit site for more
                  </a>
                ) : (
                  <Badge variant="secondary" className="gap-1.5 font-normal">
                    <FileText className="size-3.5 text-primary" />
                    {source.file_name}
                  </Badge>
                )}
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Hash className="size-3.5 text-primary" />
                  {source.page_number_str || source.page_number || "পৃষ্ঠা নেই"}
                </Badge>
                <Badge className="border-0 bg-accent text-accent-foreground">
                  {percent(source.relevance_score)} প্রাসঙ্গিক
                </Badge>
              </div>
            </DialogHeader>

            <div className="max-h-[55vh] overflow-y-auto p-5">
              <div
                dir="auto"
                className="answer-prose whitespace-pre-wrap rounded-xl border border-border bg-secondary/40 p-4 font-sans text-sm leading-loose text-foreground"
              >
                {renderFormattedAnswer(source.context_text || source.section || "API থেকে কোনো অংশ পাওয়া যায়নি.")}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
