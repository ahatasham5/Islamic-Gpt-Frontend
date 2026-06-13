import { BrandMark } from "@/components/brand-mark"
import { cn } from "@/lib/utils"
import type { AuthSession, DraftConversation } from "@/lib/app-types"
import { BookMarked, LogOut, MessageSquarePlus, MessagesSquare, UserPlus, X, MoreVertical, Pin, Trash2, Users, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

function getRoleLabel(role: AuthSession["user"]["role"]) {
  if (role === "super_admin") return ""
  if (role === "mufti") return ""

  return ""
}

export function ChatSidebar({
  session,
  conversations,
  activeConversationId,
  viewMode,
  canViewBooks,
  onNewChat,
  onSelectConversation,
  onOpenBooks,
  onOpenMuftiManagement,
  onOpenAdminFeedbacks,
  onOpenAdminUsers,
  isCreateMuftiOpen,
  onLogout,
  onCloseMobile,
  onPinConversation,
  onDeleteConversation,
  hasMoreSessions,
  isLoadingMoreSessions,
  onLoadMoreSessions,
}: {
  session: AuthSession
  conversations: DraftConversation[]
  activeConversationId: string
  viewMode: string
  canViewBooks: boolean
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onOpenBooks: () => void
  onOpenMuftiManagement: () => void
  onOpenAdminFeedbacks?: () => void
  onOpenAdminUsers?: () => void
  isCreateMuftiOpen: boolean
  onLogout: () => void
  onCloseMobile?: () => void
  onPinConversation?: (id: string, isPinned: boolean) => void
  onDeleteConversation?: (id: string) => void
  hasMoreSessions?: boolean
  isLoadingMoreSessions?: boolean
  onLoadMoreSessions?: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground">
      {/* Brand */}
<div className="flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <button
          onClick={onNewChat}
          className="flex min-w-0 items-center gap-2.5 text-left transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <BrandMark size={40} />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-heading text-sm font-bold">ইসলামী প্রশ্নোত্তর</p>
            <p className="truncate text-xs text-muted-foreground">
              {getRoleLabel(session.user.role)}
            </p>
          </div>
        </button>
        {onCloseMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      {/* New chat */}
      <div className="shrink-0 px-3 pt-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <MessageSquarePlus className="size-5" />
          নতুন আলোচনা
        </button>
      </div>

      {/* History */}
      <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-2">
        <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          আলোচনার ইতিহাস
        </p>
        <div className="space-y-1">
          {conversations.filter(c => c.turns.length > 0 || (!c.id.startsWith("chat") && c.id !== "local-new")).map((conversation) => {
            const isActive = conversation.id === activeConversationId && viewMode === "chat"
            return (
              <div
                key={conversation.id}
                className={cn(
                  "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-foreground hover:bg-sidebar-accent/60"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectConversation(conversation.id)}
                  className="flex flex-1 items-start gap-2.5 min-w-0 text-left"
                >
                  <MessagesSquare
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="block truncate text-sm font-medium">
                        {conversation.title}
                      </span>
                      {conversation.isPinned && <Pin className="size-3 shrink-0 text-primary" fill="currentColor" />}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {conversation.turns.length > 0 || conversation.id === "local-new" || conversation.id.startsWith("chat")
                        ? `${conversation.turns.length} টি বার্তা`
                        : "তথ্য দেখুন"}
                    </span>
                  </span>
                </button>
                {conversation.id !== "local-new" && onDeleteConversation && onPinConversation && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-sidebar-accent hover:text-foreground group-hover:opacity-100 data-[state=open]:opacity-100 cursor-pointer"
                    >
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPinConversation(conversation.id, !conversation.isPinned)}>
                        <Pin className="mr-2 size-4" />
                        {conversation.isPinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => onDeleteConversation(conversation.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )
          })}
          
          {hasMoreSessions && (
            <button
              onClick={onLoadMoreSessions}
              disabled={isLoadingMoreSessions}
              className="mt-4 w-full rounded-md py-2 text-xs font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground disabled:opacity-50"
            >
              {isLoadingMoreSessions ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>

      {/* Bottom */}
      {canViewBooks || session.user.role === "super_admin" ? (
        <div className="shrink-0 space-y-2 border-t border-sidebar-border bg-sidebar p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {session.user.role === "super_admin" ? (
            <button
              type="button"
              onClick={onOpenMuftiManagement}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isCreateMuftiOpen
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/30"
                  : "text-foreground hover:bg-sidebar-accent",
              )}
            >
              <UserPlus className="size-5 text-primary" />
             মুফতি আমন্ত্রণ
            </button>
          ) : null}

          {session.user.role === "super_admin" ? (
            <button
              type="button"
              onClick={onOpenAdminUsers}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                viewMode === "admin_users"
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/30"
                  : "text-foreground hover:bg-sidebar-accent",
              )}
            >
              <Users className="size-5 text-primary" />
              ব্যবহারকারী
            </button>
          ) : null}

          {session.user.role === "super_admin" ? (
            <button
              type="button"
              onClick={onOpenAdminFeedbacks}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                viewMode === "admin_feedbacks"
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/30"
                  : "text-foreground hover:bg-sidebar-accent",
              )}
            >
              <MessageSquare className="size-5 text-primary" />
              মতামত সমূহ
            </button>
          ) : null}

          {canViewBooks ? (
            <button
              type="button"
              onClick={onOpenBooks}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                viewMode === "books"
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/30"
                  : "text-foreground hover:bg-sidebar-accent",
              )}
            >
              <BookMarked className="size-5 text-primary" />
              {session.user.role === "super_admin" ? "কিতাব সমূহ" : "কিতাব সমূহ"}
            </button>
          ) : null}

          {session.user.role === "super_admin" ? (
            <div className="h-1.5 w-full bg-green-200/50 rounded-full mt-3 dark:bg-green-900/30" />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
