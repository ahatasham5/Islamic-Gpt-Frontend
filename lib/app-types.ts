import type { AuthSession, ChatResponse } from "@/lib/types"

export type ServerState = "checking" | "online" | "offline"
export type ViewMode = "chat" | "books"
export type { AuthSession }

export type ChatTurn = {
  id: string
  question: string
  response: ChatResponse
  createdAt: string
}

export type DraftConversation = {
  id: string
  title: string
  turns: ChatTurn[]
  createdAt: string
}

export const confidenceLabels: Record<ChatResponse["confidence"], string> = {
  high: "উচ্চ আস্থা",
  medium: "মাঝারি আস্থা",
  low: "নিম্ন আস্থা",
  not_found: "পাওয়া যায়নি",
}

export const relevanceLabels: Record<"high" | "medium" | "low", string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}
