import { apiRequest } from "@/lib/http"
import type { BookListResponse, BookUploadResponse } from "@/lib/types"

export const booksApi = {
  list(page: number = 1, size: number = 10) {
    return apiRequest<BookListResponse>({
      method: "GET",
      url: "/books",
      params: { page, size },
    })
  },

  search(q: string, page: number = 1, size: number = 10) {
    return apiRequest<BookListResponse>({
      method: "GET",
      url: "/books/search",
      params: { q, page, size },
    })
  },

  upload(formData: FormData) {
    return apiRequest<BookUploadResponse>({
      method: "POST",
      url: "/books/upload",
      data: formData,
    })
  },

  delete(bookId: string) {
    return apiRequest<void>({
      method: "DELETE",
      url: `/books/${encodeURIComponent(bookId)}`,
    })
  },
}
