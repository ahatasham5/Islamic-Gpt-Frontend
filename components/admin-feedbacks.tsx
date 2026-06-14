import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Eye, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, MessageSquare, Menu, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { adminApi, type AdminFeedback } from "@/lib/api/admin"
import { cn } from "@/lib/utils"
import type { AuthSession } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { renderFormattedAnswer } from "@/lib/format"

export function AdminFeedbacks({
  session,
  onOpenMobileMenu,
  onOpenSettings,
  onLogout,
}: {
  session: AuthSession
  onOpenMobileMenu: () => void
  onOpenSettings: (tab: "profile" | "security") => void
  onLogout: () => void
}) {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [feedbackToDelete, setFeedbackToDelete] = useState<AdminFeedback | null>(null)
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedback | null>(null)
  
  const size = 10
  const totalPages = Math.max(1, Math.ceil(total / size))

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
    loadFeedbacks(page)
  }, [page])

  async function executeDelete() {
    if (!feedbackToDelete) return
    setIsDeletingFeedback(true)
    try {
      await adminApi.deleteFeedback(feedbackToDelete.id)
      setFeedbackToDelete(null)
      loadFeedbacks(page)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsDeletingFeedback(false)
    }
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-2 sm:gap-3 border-b border-border bg-card/60 px-3 sm:px-4 py-3 sm:py-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
            aria-label="মেনু খুলুন"
          >
            <Menu className="size-4 sm:size-5" />
          </button>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-primary">
              Admin Area
            </p>
            <h1 className="font-heading text-base sm:text-lg font-bold leading-tight md:text-xl">
              মতামত সমূহ
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-card py-1 sm:py-1.5 pl-1 sm:pl-1.5 pr-2 sm:pr-3 text-xs sm:text-sm font-medium transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <span className="inline-flex size-5 sm:size-6 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-[10px] sm:text-xs">
                {session.user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden md:inline-block max-w-[80px] lg:max-w-[100px] truncate text-foreground">
                {session.user.name}
              </span>
              <ChevronDown className="size-3 sm:size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => onOpenSettings("profile")}>
                <User className="mr-2 size-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => onOpenSettings("security")}>
                <Settings className="mr-2 size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={onLogout}>
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="w-full flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex h-48 sm:h-64 items-center justify-center">
              <Loader2 className="size-6 sm:size-8 animate-spin text-muted-foreground" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="flex h-48 sm:h-64 flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="mb-3 sm:mb-4 size-10 sm:size-12 opacity-20" />
              <p className="text-sm sm:text-base">কোনো মতামত পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                  <thead className="bg-secondary/50 text-muted-foreground">
                    <tr>
                      <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 font-medium">মুফতির নাম</th>
                      <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 font-medium hidden sm:table-cell">তারিখ</th>
                      <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 font-medium text-center">মতামত</th>
                      <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 font-medium text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {feedbacks.map((f) => (
                      <tr key={f.id} className="transition even:bg-muted/30 hover:bg-accent/20">
                        <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
                          <div className="font-semibold text-foreground text-xs sm:text-sm">
                            {f.mufti_name}
                          </div>
                          <div className="text-[10px] sm:hidden text-muted-foreground mt-0.5">
                            {new Date(f.created_at).toLocaleDateString("bn-BD")}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-muted-foreground hidden sm:table-cell">
                          {new Date(f.created_at).toLocaleString("bn-BD")}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-center">
                          {f.is_good === true ? (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-green-50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              <ThumbsUp className="size-2.5 sm:size-3" /> <span className="hidden xs:inline">সঠিক</span>
                            </span>
                          ) : f.is_good === false ? (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-red-50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                              <ThumbsDown className="size-2.5 sm:size-3" /> <span className="hidden xs:inline">ভুল</span>
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 sm:h-8 gap-0.5 sm:gap-1 px-2 sm:px-3 text-xs"
                              onClick={() => setSelectedFeedback(f)}
                            >
                              <Eye className="size-3 sm:size-3.5" />
                              <span className="hidden sm:inline">বিস্তারিত</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={feedbackToDelete?.id === f.id || isDeletingFeedback}
                              onClick={() => setFeedbackToDelete(f)}
                              className="size-7 sm:size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label="মুছে ফেলুন"
                            >
                              <Trash2 className="size-3.5 sm:size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 border-t border-border px-3 sm:px-4 md:px-6 py-3 sm:py-4 mt-auto">
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground text-center sm:text-left">
                  Showing <span className="font-medium text-foreground">{(page - 1) * size + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * size, total)}</span> of <span className="font-medium text-foreground">{total}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 sm:gap-1.5 h-7 sm:h-8 px-2 sm:px-3 text-xs"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="size-3 sm:size-4" />
                    <span className="hidden xs:inline">Previous</span>
                  </Button>
                  <div className="text-[10px] sm:text-xs md:text-sm font-medium px-1 sm:px-2">
                    {page}/{totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 sm:gap-1.5 h-7 sm:h-8 px-2 sm:px-3 text-xs"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage(page + 1)}
                  >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="size-3 sm:size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden">
          <DialogHeader className="shrink-0 mb-3 sm:mb-4">
            <DialogTitle className="text-lg sm:text-xl">মতামতের বিস্তারিত (Feedback Details)</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              মুফতি <strong>{selectedFeedback?.mufti_name}</strong> এর প্রদত্ত মতামত এবং সংশ্লিষ্ট চ্যাট সেশন।
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-1 sm:pr-2">
            {/* User Query */}
            {selectedFeedback?.user_query && (
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide border-b pb-1">User Query (প্রশ্ন)</h3>
                <div className="bg-muted/30 p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm leading-relaxed text-foreground font-medium">
                  {selectedFeedback.user_query}
                </div>
              </div>
            )}

            {/* AI Response */}
            {selectedFeedback?.ai_response?.answer && (
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide border-b pb-1">AI Answer (উত্তর)</h3>
                <div className="bg-card border p-3 sm:p-5 rounded-lg sm:rounded-xl answer-prose text-xs sm:text-[0.95rem] leading-relaxed text-foreground text-justify" dir="auto">
                  {renderFormattedAnswer(selectedFeedback.ai_response.answer)}
                </div>
              </div>
            )}

            {/* Mufti Feedback */}
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide border-b pb-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                Mufti Feedback (মতামত)
                {selectedFeedback?.is_good === true && (
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-green-50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <ThumbsUp className="size-2.5 sm:size-3" /> সঠিক
                  </span>
                )}
                {selectedFeedback?.is_good === false && (
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-red-50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    <ThumbsDown className="size-2.5 sm:size-3" /> ভুল
                  </span>
                )}
              </h3>
              {selectedFeedback?.feedback_text ? (
                <div
                  className="bg-accent/20 p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm leading-relaxed text-foreground prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: selectedFeedback.feedback_text }}
                />
              ) : (
                <div className="bg-muted/10 p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm italic text-muted-foreground border border-dashed">
                  কোনো টেক্সট মতামত দেওয়া হয়নি।
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {feedbackToDelete && (
        <ConfirmDialog
          open={!!feedbackToDelete}
          onOpenChange={(open) => !open && setFeedbackToDelete(null)}
          title="মতামত মুছে ফেলুন"
          description="আপনি কি নিশ্চিত যে আপনি এই মতামতটি মুছে ফেলতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফেরানো যাবে না।"
          onConfirm={executeDelete}
          isLoading={isDeletingFeedback}
        />
      )}
    </section>
  )
}
