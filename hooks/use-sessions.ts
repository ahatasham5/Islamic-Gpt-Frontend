import { useState, useCallback, useEffect } from "react"
import { sessionsApi } from "@/lib/api/sessions"
import { getApiErrorMessage } from "@/lib/http"
import type { SessionSummary, SessionDetailResponse } from "@/lib/types"

export function useSessions(enabled: boolean) {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const loadSessions = useCallback(async () => {
    if (!enabled) return
    setIsLoading(true)
    setError("")
    try {
      const response = await sessionsApi.getSessions(1, 50)
      setSessions(response.sessions)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const deleteSession = useCallback(async (id: number) => {
    try {
      await sessionsApi.deleteSession(id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      setError(getApiErrorMessage(err))
      throw err
    }
  }, [])

  const pinSession = useCallback(async (id: number, isPinned: boolean) => {
    try {
      await sessionsApi.pinSession(id, isPinned)
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_pinned: isPinned } : s))
      )
      loadSessions() // To keep the list sorted by pinned
    } catch (err) {
      setError(getApiErrorMessage(err))
      throw err
    }
  }, [loadSessions])

  return {
    sessions,
    isLoading,
    error,
    loadSessions,
    deleteSession,
    pinSession,
  }
}
