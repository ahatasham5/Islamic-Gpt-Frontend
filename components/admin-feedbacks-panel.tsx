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
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>মতামত সমূহ</DialogTitle>
          <DialogDescription>
            মুফতিদের দেওয়া সকল মতামতের তালিকা।
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2 space-y-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="mb-4 size-12 opacity-20" />
              <p>কোনো মতামত পাওয়া যায়নি।</p>
            </div>
          ) : (
            feedbacks.map((f) => (
              <div key={f.id} className="rounded-xl border border-border bg-card p-4 shadow-sm relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{f.mufti_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(f.created_at).toLocaleString("bn-BD")}
                      </span>
                      {f.is_good === true && (
                        <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          <ThumbsUp className="size-3" /> সঠিক
                        </span>
                      )}
                      {f.is_good === false && (
                        <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                          <ThumbsDown className="size-3" /> ভুল
                        </span>
                      )}
                    </div>
                    {f.feedback_text ? (
                      <div
                        className="text-sm prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: f.feedback_text }}
                      />
                    ) : (
                      <p className="text-sm italic text-muted-foreground">কোনো টেক্সট মতামত দেওয়া হয়নি।</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(f.id)}
                    disabled={isDeleting === f.id}
                  >
                    {isDeleting === f.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {total > size && (
          <div className="shrink-0 flex items-center justify-between border-t border-border pt-4 mt-2">
            <span className="text-sm text-muted-foreground">
              Total {total} feedbacks
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * size >= total || isLoading}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
