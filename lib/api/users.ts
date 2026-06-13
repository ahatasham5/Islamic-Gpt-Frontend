import { apiRequest } from "@/lib/http"
import type { UserResponse, ForgotPassword, ResetPassword } from "@/lib/types"

export const usersApi = {
  getMe() {
    return apiRequest<UserResponse>({
      method: "GET",
      url: "/users/me",
    })
  },

  forgotPassword(payload: ForgotPassword) {
    return apiRequest<string>({
      method: "POST",
      url: "/users/forgot-password",
      data: payload,
    })
  },

  resetPassword(payload: ResetPassword) {
    return apiRequest<string>({
      method: "POST",
      url: "/users/reset-password",
      data: payload,
    })
  },
}
