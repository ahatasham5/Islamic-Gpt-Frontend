"use client"

import { type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import type { BookInfo } from "@/lib/types"
import { BookOpen, FileUp, Layers, Loader2, Menu, Trash2, User } from "lucide-react"

function getBookLabel(book: BookInfo) {
  return book.book_title || book.file_name || book.book_id
}

export function BookManager({
  books,
  isLoadingBooks,
  uploadMessage,
  isUploading,
  deletingBookId,
  onUpload,
  onDelete,
  onOpenMobileMenu,
}: {
  books: BookInfo[]
  isLoadingBooks: boolean
  uploadMessage: string
  isUploading: boolean
  deletingBookId: string | null
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onDelete: (book: BookInfo) => void
  onOpenMobileMenu: () => void
}) {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card/60 px-4 py-3.5 backdrop-blur md:px-6">
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
              কিতাব ম্যানেজ করুন
            </h1>
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 aria-disabled:opacity-60">
          <input type="file" accept=".md" onChange={onUpload} disabled={isUploading} className="hidden" />
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
          <span className="hidden sm:inline">{isUploading ? "আপলোড হচ্ছে..." : "নতুন কিতাব আপলোড"}</span>
          <span className="sm:hidden">{isUploading ? "..." : "আপলোড"}</span>
        </label>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          {uploadMessage ? (
            <p className="mb-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
              {uploadMessage}
            </p>
          ) : null}

          <p className="mb-3 text-sm text-muted-foreground">
            শুধুমাত্র <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">.md</code> ফরম্যাটের কিতাব আপলোড করা যাবে।
          </p>

          {isLoadingBooks ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              লোড হচ্ছে...
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <BookOpen className="size-6" />
              </span>
              <p className="mt-4 font-medium text-foreground">কোনো কিতাব নেই</p>
              <p className="mt-1 text-sm text-muted-foreground">
                প্রথম কিতাবটি আপলোড করে শুরু করুন।
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {books.map((book) => (
                <article
                  key={book.book_id}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition hover:shadow-sm"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <BookOpen className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <strong dir="auto" className="block text-[0.95rem] font-semibold text-foreground">
                      {getBookLabel(book)}
                    </strong>
                    <p dir="auto" className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="size-3.5" />
                      {book.author || book.file_name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="size-3.5" />
                        {book.total_chunks} chunks
                      </span>
                      {book.volume ? <span>খণ্ড {book.volume}</span> : null}
                      {book.ingested_at ? <span>{formatDate(book.ingested_at)}</span> : null}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingBookId === book.book_id}
                    onClick={() => onDelete(book)}
                    className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="মুছে ফেলুন"
                  >
                    {deletingBookId === book.book_id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
