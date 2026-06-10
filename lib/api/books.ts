import { apiRequest } from "@/lib/http"
import type { BookListResponse, BookUploadResponse } from "@/lib/types"

export const booksApi = {
  list() {
    return apiRequest<BookListResponse>({
      method: "GET",
      url: "/books",
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
