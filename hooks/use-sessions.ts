import { useState, useCallback, useEffect, useRef } from "react"
import { sessionsApi } from "@/lib/api/sessions"
import { getApiErrorMessage } from "@/lib/http"
import type { SessionSummary } from "@/lib/types"

export function useSessions(enabled: boolean) {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Use a ref for the current page so loadSessions doesn't need it as a dep
  const pageRef = useRef(1)

  const loadSessions = useCallback(async (reset = true) => {
    if (!enabled) return
    if (reset) {
      setIsLoading(true)
      pageRef.current = 1
    } else {
      setIsLoadingMore(true)
    }
    setError("")

    try {
      const currentPage = reset ? 1 : pageRef.current + 1
      const response = await sessionsApi.getSessions(currentPage, 30)

      setSessions((prev) => reset ? response.sessions : [...prev, ...response.sessions])
      setHasMore(response.page * response.size < response.total)
      pageRef.current = currentPage
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      if (reset) setIsLoading(false)
      else setIsLoadingMore(false)
    }
  }, [enabled]) // no `page` dep — uses ref instead

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
      loadSessions()
    } catch (err) {
      setError(getApiErrorMessage(err))
      throw err
    }
  }, [loadSessions])

  return {
    sessions,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadSessions,
    loadMoreSessions: () => loadSessions(false),
    deleteSession,
    pinSession,
  }
}
