"use client"

import { useCallback, useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"
import { getApiErrorMessage, setAuthToken } from "@/lib/http"
import type { AuthSession, Token, UserCreate, UserLogin, VerifyOTP } from "@/lib/types"

const STORAGE_KEY = "islamic-gpt-auth-session"

function tokenToSession(token: Token): AuthSession {
  return {
    accessToken: token.access_token,
    tokenType: token.token_type,
    user: token.user,
  }
}

function saveSession(session: AuthSession | null) {
  if (typeof window === "undefined") return

  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isRestoring, setIsRestoring] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)

      if (stored) {
        const parsed = JSON.parse(stored) as AuthSession

        if (parsed?.accessToken && parsed?.user?.email) {
          setSession(parsed)
          setAuthToken(parsed.accessToken)
        } else {
          saveSession(null)
          setAuthToken(null)
        }
      }
    } catch {
      saveSession(null)
      setAuthToken(null)
    } finally {
      setIsRestoring(false)
    }
  }, [])

  const login = useCallback(async (payload: UserLogin) => {
    setError("")
    setIsSubmitting(true)

    try {
      const token = await authApi.login(payload)
      const nextSession = tokenToSession(token)

      setSession(nextSession)
      setAuthToken(nextSession.accessToken)
      saveSession(nextSession)

      return nextSession
    } catch (error) {
      const message = getApiErrorMessage(error)
      setError(message)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const signup = useCallback(async (payload: UserCreate) => {
    setError("")
    setIsSubmitting(true)

    try {
      await authApi.signup(payload)
    } catch (error) {
      const message = getApiErrorMessage(error)
      setError(message)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const verifyOtp = useCallback(async (payload: VerifyOTP) => {
    setError("")
    setIsVerifying(true)

    try {
      return await authApi.verifyOtp(payload)
    } catch (error) {
      const message = getApiErrorMessage(error)
      setError(message)
      throw error
    } finally {
      setIsVerifying(false)
    }
  }, [])

  const resendOtp = useCallback(async (email: string) => {
    setError("")
    setIsResending(true)

    try {
      await authApi.resendOtp({ email })
    } catch (error) {
      const message = getApiErrorMessage(error)
      setError(message)
      throw error
    } finally {
      setIsResending(false)
    }
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setError("")
    setAuthToken(null)
    saveSession(null)
  }, [])

  return {
    session,
    isRestoring,
    isSubmitting,
    isVerifying,
    isResending,
    error,
    clearError: () => setError(""),
    login,
    signup,
    verifyOtp,
    resendOtp,
    logout,
  }
}
