import { type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import type { BookInfo, AuthSession } from "@/lib/types"
import { BookOpen, FileUp, Loader2, Menu, Trash2, ChevronLeft, ChevronRight, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function getBookLabel(book: BookInfo) {
  return book.book_title || book.file_name || book.book_id
}

export function BookManager({
  books,
  isLoadingBooks,
  uploadMessage,
  isUploading,
  deletingBookId,
  canManageBooks,
  page,
  size,
  total,
  onPageChange,
  onUpload,
  onDelete,
  onOpenMobileMenu,
  session,
  onLogout,
  onOpenSettings,
}: {
  books: BookInfo[]
  isLoadingBooks: boolean
  uploadMessage: string
  isUploading: boolean
  deletingBookId: string | null
  canManageBooks: boolean
  page: number
  size: number
  total: number
  onPageChange: (page: number) => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onDelete: (book: BookInfo) => void
  onOpenMobileMenu: () => void
  session: AuthSession
  onLogout: () => void
  onOpenSettings: (tab: "profile" | "security") => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / size))

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card/60 px-4 py-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
            aria-label="মেনু খুলুন"
          >
            <Menu className="size-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Library
            </p>
            <h1 className="font-heading text-lg font-bold leading-tight md:text-xl">
              {canManageBooks ? "কিতাব ম্যানেজ করুন" : "কিতাব সমূহ"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canManageBooks ? (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 aria-disabled:opacity-60">
              <input type="file" accept=".md" onChange={onUpload} disabled={isUploading} className="hidden" />
              {isUploading ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
              <span className="hidden sm:inline">{isUploading ? "আপলোড হচ্ছে..." : "নতুন কিতাব আপলোড"}</span>
              <span className="sm:hidden">{isUploading ? "..." : "আপলোড"}</span>
            </label>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 text-sm font-medium transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs">
                {session.user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden md:inline-block max-w-[100px] truncate text-foreground">
                {session.user.name}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
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

      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="w-full flex-1 flex flex-col">
          {uploadMessage ? (
            <p className="mb-4 shrink-0 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
              {uploadMessage}
            </p>
          ) : null}

          {canManageBooks ? (
            <p className="mb-4 shrink-0 text-sm text-muted-foreground font-bold">
              শুধুমাত্র <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">.md</code> ফরম্যাটের কিতাব আপলোড করা যাবে।
            </p>
          ) : null}

          {isLoadingBooks ? (
            <div className="flex flex-1 items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              লোড হচ্ছে...
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <BookOpen className="size-6" />
              </span>
              <p className="mt-4 font-medium text-foreground">কোনো কিতাব নেই</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {canManageBooks ? "প্রথম কিতাবটি আপলোড করে শুরু করুন।" : "আপাতত কোনো কিতাব নেই।"}
              </p>
            </div>
          ) : (
            <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Author</th>
                      <th className="px-6 py-4 font-medium">Language</th>
                      <th className="px-6 py-4 font-medium">Chunks</th>
                      <th className="px-6 py-4 font-medium">Ingested At</th>
                      {canManageBooks && <th className="px-6 py-4 font-medium text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {books.map((book) => (
                      <tr key={book.book_id} className="transition even:bg-muted/30 hover:bg-accent/20">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/50 text-primary">
                              <BookOpen className="size-4" />
                            </span>
                            <strong className="font-semibold text-foreground max-w-[200px] sm:max-w-[300px] truncate" title={getBookLabel(book)}>
                              {getBookLabel(book)}
                            </strong>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground max-w-[150px] truncate" title={book.author || ""}>
                          {book.author || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {book.language === "bn" ? "বাংলা" : book.language === "en" ? "English" : book.language || "-"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {book.total_chunks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {book.ingested_at ? formatDate(book.ingested_at) : "-"}
                        </td>
                        {canManageBooks && (
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingBookId === book.book_id}
                              onClick={() => onDelete(book)}
                              className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label="মুছে ফেলুন"
                            >
                              {deletingBookId === book.book_id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-border px-6 py-4 mt-auto">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(page - 1) * size + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * size, total)}</span> of <span className="font-medium text-foreground">{total}</span> entries
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={page <= 1 || isLoadingBooks}
                    onClick={() => onPageChange(page - 1)}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium px-2">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={page >= totalPages || isLoadingBooks}
                    onClick={() => onPageChange(page + 1)}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
