import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Users as UsersIcon, ChevronLeft, ChevronRight, Menu, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { adminApi, type AdminUser } from "@/lib/api/admin"
import { cn } from "@/lib/utils"
import type { AuthSession } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/confirm-dialog"

export function AdminUsers({
  session,
  onOpenMobileMenu,
  onOpenSettings,
  onLogout,
}: {
  session: AuthSession
  onOpenMobileMenu: () => void
  onOpenSettings: (tab: "profile" | "security") => void
  onLogout: () => void
}) {
  const currentUserId = session?.user?.id
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isActioning, setIsActioning] = useState<number | null>(null)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const size = 10
  const totalPages = Math.max(1, Math.ceil(total / size))

  async function loadUsers(p: number) {
    setIsLoading(true)
    try {
      const data = await adminApi.getUsers(p, size)
      setUsers(data.users)
      setTotal(data.total)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers(page)
  }, [page])

  async function executeDelete() {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      await adminApi.deleteUser(userToDelete.id)
      setUserToDelete(null)
      loadUsers(page)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    setIsActioning(id)
    try {
      await adminApi.activateUser(id, !currentStatus)
      loadUsers(page)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsActioning(null)
    }
  }

  async function handleChangeRole(id: number, role: string) {
    setIsActioning(id)
    try {
      await adminApi.changeUserRole(id, role)
      loadUsers(page)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsActioning(null)
    }
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-2 sm:gap-3 border-b border-border bg-card/60 px-3 sm:px-4 py-3 sm:py-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
            aria-label="মেনু খুলুন"
          >
            <Menu className="size-4 sm:size-5" />
          </button>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-primary">
              Admin Area
            </p>
            <h1 className="font-heading text-base sm:text-lg font-bold leading-tight md:text-xl">
              ব্যবহারকারী
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-card py-1 sm:py-1.5 pl-1 sm:pl-1.5 pr-2 sm:pr-3 text-xs sm:text-sm font-medium transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <span className="inline-flex size-5 sm:size-6 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-[10px] sm:text-xs">
                {session.user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden md:inline-block max-w-[80px] lg:max-w-[100px] truncate text-foreground">
                {session.user.name}
              </span>
              <ChevronDown className="size-3 sm:size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => onOpenSettings("profile")}>
                <User className="mr-2 size-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => onOpenSettings("security")}>
                <Settings className="mr-2 size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={onLogout}>
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="w-full flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <UsersIcon className="mb-4 size-12 opacity-20" />
              <p>কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium">নাম</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium">ইমেইল</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium">রোল (Role)</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium">স্ট্যাটাস</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => {
                      const isSelf = currentUserId === u.id
                      return (
                        <tr key={u.id} className="transition even:bg-muted/30 hover:bg-accent/20">
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              <span className="truncate">{u.name}</span>
                              {isSelf && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary font-bold tracking-wider shrink-0">You</span>}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="truncate">{u.email}</span>
                              {!u.is_verified && (
                                <span className="text-[10px] text-destructive border border-destructive/30 px-1 rounded-sm bg-destructive/5 whitespace-nowrap shrink-0">Pending Verification</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <select
                              disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              className="h-8 w-[110px] lg:w-[130px] rounded-md border border-input bg-background px-2 lg:px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="user">User</option>
                              <option value="mufti">Mufti</option>
                              <option value="super_admin" disabled>Super Admin</option>
                            </select>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={u.is_active}
                                disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                                onClick={() => handleToggleStatus(u.id, u.is_active)}
                                className={cn(
                                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                  u.is_active ? "bg-primary" : "bg-border"
                                )}
                              >
                                <span className="sr-only">Toggle active status</span>
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                                    u.is_active ? "translate-x-4" : "translate-x-0"
                                  )}
                                />
                              </button>
                              <span className={cn("text-xs font-medium hidden lg:inline", u.is_active ? "text-primary" : "text-muted-foreground")}>
                                {u.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                              onClick={() => setUserToDelete(u)}
                              className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              title="Delete User"
                            >
                              {isActioning === u.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards - Shown on mobile only */}
              <div className="md:hidden space-y-3 p-3 sm:p-4">
                {users.map((u) => {
                  const isSelf = currentUserId === u.id
                  return (
                    <div key={u.id} className="bg-background border border-border rounded-lg p-4 space-y-3">
                      {/* User Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                            <span className="truncate">{u.name}</span>
                            {isSelf && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary font-bold tracking-wider shrink-0">You</span>}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
                            <span className="truncate">{u.email}</span>
                            {!u.is_verified && (
                              <span className="text-[10px] text-destructive border border-destructive/30 px-1 rounded-sm bg-destructive/5 whitespace-nowrap shrink-0">Pending Verification</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                          onClick={() => setUserToDelete(u)}
                          className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 ml-2"
                          title="Delete User"
                        >
                          {isActioning === u.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </Button>
                      </div>

                      {/* Role & Status Controls */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground font-medium block mb-1">রোল (Role)</label>
                          <select
                            disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="user">User</option>
                            <option value="mufti">Mufti</option>
                            <option value="super_admin" disabled>Super Admin</option>
                          </select>
                        </div>
                        <div className="shrink-0">
                          <label className="text-xs text-muted-foreground font-medium block mb-1">স্ট্যাটাস</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={u.is_active}
                              disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                              onClick={() => handleToggleStatus(u.id, u.is_active)}
                              className={cn(
                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                u.is_active ? "bg-primary" : "bg-border"
                              )}
                            >
                              <span className="sr-only">Toggle active status</span>
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                                  u.is_active ? "translate-x-4" : "translate-x-0"
                                )}
                              />
                            </button>
                            <span className={cn("text-xs font-medium", u.is_active ? "text-primary" : "text-muted-foreground")}>
                              {u.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mt-auto">
                <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                  <span className="hidden sm:inline">Showing </span>
                  <span className="font-medium text-foreground">{(page - 1) * size + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * size, total)}</span> of <span className="font-medium text-foreground">{total}</span>
                  <span className="hidden sm:inline"> entries</span>
                </div>

                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 sm:gap-1.5 h-8 px-2 sm:px-3"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="size-3 sm:size-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <div className="text-xs sm:text-sm font-medium px-2">
                    <span className="hidden sm:inline">Page </span>{page}<span className="hidden sm:inline"> of {totalPages}</span>
                    <span className="sm:hidden">/{totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 sm:gap-1.5 h-8 px-2 sm:px-3"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage(page + 1)}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="size-3 sm:size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {userToDelete && (
        <ConfirmDialog
          open={!!userToDelete}
          onOpenChange={(open) => !open && setUserToDelete(null)}
          title="ব্যবহারকারী মুছে ফেলুন"
          description={`আপনি কি নিশ্চিত যে আপনি ${userToDelete.name} কে মুছে ফেলতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফেরানো যাবে না।`}
          onConfirm={executeDelete}
          isLoading={isDeleting}
        />
      )}
    </section>
  )
}
