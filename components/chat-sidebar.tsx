import { BrandMark } from "@/components/brand-mark"
import { cn } from "@/lib/utils"
import type { AuthSession, DraftConversation } from "@/lib/app-types"
import { BookMarked, LogOut, MessageSquarePlus, MessagesSquare, UserPlus, X } from "lucide-react"

function getRoleLabel(role: AuthSession["user"]["role"]) {
  if (role === "super_admin") return "Super admin"
  if (role === "mufti") return "Mufti"

  return "User"
}

export function ChatSidebar({
  session,
  conversations,
  activeConversationId,
  viewMode,
  canManageBooks,
  onNewChat,
  onSelectConversation,
  onOpenBooks,
  onOpenMuftiManagement,
  onLogout,
  onCloseMobile,
}: {
  session: AuthSession
  conversations: DraftConversation[]
  activeConversationId: string
  viewMode: "chat" | "books" | "mufti-management"
  canManageBooks: boolean
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onOpenBooks: () => void
  onOpenMuftiManagement: () => void
  onLogout: () => void
  onCloseMobile?: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-sidebar-border px-4 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <BrandMark size={40} />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-heading text-sm font-bold">ফতোয়া চ্যাট বট</p>
            <p className="truncate text-xs text-muted-foreground">
              {getRoleLabel(session.user.role)}
            </p>
          </div>
        </div>
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
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId && viewMode === "chat"
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-foreground hover:bg-sidebar-accent/60",
                )}
              >
                <MessagesSquare
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {conversation.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {conversation.turns.length} টি বার্তা
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 space-y-2 border-t border-sidebar-border bg-sidebar p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {canManageBooks ? (
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
            কিতাব ম্যানেজ করুন
          </button>
        ) : null}

        {session.user.role === "super_admin" ? (
          <button
            type="button"
            onClick={onOpenMuftiManagement}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              viewMode === "mufti-management"
                ? "bg-accent text-accent-foreground ring-1 ring-primary/30"
                : "text-foreground hover:bg-sidebar-accent",
            )}
          >
            <UserPlus className="size-5 text-primary" />
            Create Mufti
          </button>
        ) : null}

        <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
            {session.user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {session.user.name}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-sidebar-accent hover:text-destructive"
            aria-label="লগআউট"
            title="লগআউট"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
