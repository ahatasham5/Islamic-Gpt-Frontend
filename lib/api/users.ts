import { apiRequest } from "@/lib/http"
import type { UserResponse } from "@/lib/types"

export const usersApi = {
  getMe() {
    return apiRequest<UserResponse>({
      method: "GET",
      url: "/users/me",
    })
  },
}
