import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react"
import { adminApi, type AdminFeedback } from "@/lib/api/admin"
import { cn } from "@/lib/utils"

export function AdminFeedbacksDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const size = 10

  async function loadFeedbacks(p: number) {
    setIsLoading(true)
    try {
      const data = await adminApi.getFeedbacks(p, size)
      setFeedbacks(data.feedbacks)
      setTotal(data.total)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadFeedbacks(page)
    }
  }, [open, page])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this feedback?")) return
    setIsDeleting(id)
    try {
      await adminApi.deleteFeedback(id)
      loadFeedbacks(page)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg sm:text-xl">মতামত সমূহ</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            মুফতিদের দেওয়া সকল মতামতের তালিকা।
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-3 sm:py-4 pr-1 sm:pr-2 space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-6 sm:size-8 animate-spin text-muted-foreground" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="mb-3 sm:mb-4 size-10 sm:size-12 opacity-20" />
              <p className="text-sm sm:text-base">কোনো মতামত পাওয়া যায়নি।</p>
            </div>
          ) : (
            feedbacks.map((f) => (
              <div key={f.id} className="rounded-lg sm:rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm relative">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <span className="font-semibold text-xs sm:text-sm">{f.mufti_name}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {new Date(f.created_at).toLocaleDateString("bn-BD")}
                      </span>
                      {f.is_good === true && (
                        <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-green-50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          <ThumbsUp className="size-2.5 sm:size-3" /> <span className="hidden xs:inline">সঠিক</span>
                        </span>
                      )}
                      {f.is_good === false && (
                        <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-red-50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                          <ThumbsDown className="size-2.5 sm:size-3" /> <span className="hidden xs:inline">ভুল</span>
                        </span>
                      )}
                    </div>
                    {f.feedback_text ? (
                      <div
                        className="text-xs sm:text-sm prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: f.feedback_text }}
                      />
                    ) : (
                      <p className="text-xs sm:text-sm italic text-muted-foreground">কোনো টেক্সট মতামত দেওয়া হয়নি।</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 size-7 sm:size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(f.id)}
                    disabled={isDeleting === f.id}
                  >
                    {isDeleting === f.id ? <Loader2 className="size-3.5 sm:size-4 animate-spin" /> : <Trash2 className="size-3.5 sm:size-4" />}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {total > size && (
          <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 border-t border-border pt-3 sm:pt-4 mt-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Total {total} feedbacks
            </span>
            <div className="flex gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 sm:h-8 text-xs gap-0.5 sm:gap-1 px-2 sm:px-3"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="size-3 sm:size-4" />
                <span className="hidden xs:inline">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 sm:h-8 text-xs gap-0.5 sm:gap-1 px-2 sm:px-3"
                onClick={() => setPage(p => p + 1)}
                disabled={page * size >= total || isLoading}
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="size-3 sm:size-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
