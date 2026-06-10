import { apiRequest } from "@/lib/http"
import type { ResendOTP, Token, UserCreate, UserLogin, UserResponse, VerifyOTP } from "@/lib/types"

type EmptyResponse = Record<string, never>

export const authApi = {
  signup(payload: UserCreate) {
    return apiRequest<EmptyResponse>({
      method: "POST",
      url: "/auth/signup",
      data: payload,
    })
  },

  resendOtp(payload: ResendOTP) {
    return apiRequest<EmptyResponse>({
      method: "POST",
      url: "/auth/resend-otp",
      data: payload,
    })
  },

  verifyOtp(payload: VerifyOTP) {
    return apiRequest<UserResponse>({
      method: "POST",
      url: "/auth/verify-otp",
      data: payload,
    })
  },

  login(payload: UserLogin) {
    return apiRequest<Token>({
      method: "POST",
      url: "/auth/login",
      data: payload,
    })
  },
}
