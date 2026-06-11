import { useCallback, useEffect, useState } from "react"
import { booksApi } from "@/lib/api/books"
import { getApiErrorMessage } from "@/lib/http"
import type { BookInfo } from "@/lib/types"

export function useBooks(enabled: boolean) {
  const [books, setBooks] = useState<BookInfo[]>([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)

  const loadBooks = useCallback(async () => {
    if (!enabled) return

    setIsLoadingBooks(true)

    try {
      const response = await booksApi.list(page, size)
      setBooks(response.books)
      setTotal(response.total)
    } catch (error) {
      setUploadMessage(getApiErrorMessage(error))
    } finally {
      setIsLoadingBooks(false)
    }
  }, [enabled, page, size])

  useEffect(() => {
    if (!enabled) {
      setBooks([])
      setUploadMessage("")
      return
    }

    loadBooks()
  }, [enabled, loadBooks])

  const uploadBook = useCallback(
    async (formData: FormData) => {
      setIsUploading(true)
      setUploadMessage("")

      try {
        const response = await booksApi.upload(formData)
        setUploadMessage(response.message)
        await loadBooks()
      } catch (error) {
        setUploadMessage(getApiErrorMessage(error))
      } finally {
        setIsUploading(false)
      }
    },
    [loadBooks],
  )

  const deleteBook = useCallback(
    async (book: BookInfo) => {
      setDeletingBookId(book.book_id)
      setUploadMessage("")

      try {
        await booksApi.delete(book.book_id)
        await loadBooks()
      } catch (error) {
        setUploadMessage(getApiErrorMessage(error))
      } finally {
        setDeletingBookId(null)
      }
    },
    [loadBooks],
  )

  return {
    books,
    isLoadingBooks,
    uploadMessage,
    isUploading,
    deletingBookId,
    page,
    size,
    total,
    setPage,
    setSize,
    setUploadMessage,
    loadBooks,
    uploadBook,
    deleteBook,
  }
}
