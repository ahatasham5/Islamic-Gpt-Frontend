import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Users as UsersIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { adminApi, type AdminUser } from "@/lib/api/admin"
import { cn } from "@/lib/utils"

export function AdminUsersDialog({
  open,
  onOpenChange,
  currentUserId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId?: number
}) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isActioning, setIsActioning] = useState<number | null>(null)
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
    if (open) {
      loadUsers(page)
    }
  }, [open, page])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return
    setIsActioning(id)
    try {
      await adminApi.deleteUser(id)
      loadUsers(page)
    } catch (error: any) {
      alert(error.message || "Something went wrong.")
    } finally {
      setIsActioning(null)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] lg:w-[85vw] h-[90vh] sm:h-[85vh] flex flex-col p-3 sm:p-4 md:p-6">
        <DialogHeader className="shrink-0 pb-2">
          <DialogTitle className="text-base sm:text-lg md:text-xl">ব্যবহারকারী</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            সকল ব্যবহারকারী, মুফতি এবং অ্যাডমিনদের পরিচালনা করুন।
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2 sm:py-3">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-6 sm:size-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <UsersIcon className="mb-4 size-10 sm:size-12 opacity-20" />
              <p className="text-sm sm:text-base">কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Desktop Table – md and above */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-3 lg:px-4 py-3 font-medium">নাম ও ইমেইল</th>
                      <th className="px-3 lg:px-4 py-3 font-medium">রোল (Role)</th>
                      <th className="px-3 lg:px-4 py-3 font-medium">স্ট্যাটাস</th>
                      <th className="px-3 lg:px-4 py-3 font-medium text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => {
                      const isSelf = currentUserId === u.id
                      return (
                        <tr key={u.id} className="bg-card hover:bg-muted/20 transition">
                          <td className="px-3 lg:px-4 py-3">
                            <div className="font-medium text-foreground flex items-center gap-2">
                              <span className="truncate">{u.name}</span>
                              {isSelf && (
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary font-bold tracking-wider shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span className="truncate">{u.email}</span>
                              {!u.is_verified && (
                                <span className="text-[10px] text-destructive border border-destructive/30 px-1 rounded-sm bg-destructive/5 shrink-0">
                                  Pending Verification
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 lg:px-4 py-3">
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
                          <td className="px-3 lg:px-4 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={u.is_active}
                                disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                                onChange={() => handleToggleStatus(u.id, u.is_active)}
                                className="size-4"
                              />
                              <span className={cn("text-xs font-medium", u.is_active ? "text-green-600" : "text-muted-foreground")}>
                                {u.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 lg:px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                              onClick={() => handleDelete(u.id)}
                              disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
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

              {/* Mobile Cards – below md */}
              <div className="md:hidden divide-y divide-border">
                {users.map((u) => {
                  const isSelf = currentUserId === u.id
                  return (
                    <div key={u.id} className="bg-card p-3 sm:p-4 space-y-3">
                      {/* Name / Email row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground flex items-center gap-2 flex-wrap">
                            <span className="truncate">{u.name}</span>
                            {isSelf && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary font-bold tracking-wider shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                            <span className="truncate">{u.email}</span>
                            {!u.is_verified && (
                              <span className="text-[10px] text-destructive border border-destructive/30 px-1 rounded-sm bg-destructive/5 shrink-0">
                                Pending Verification
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0"
                          onClick={() => handleDelete(u.id)}
                          disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                          title="Delete User"
                        >
                          {isActioning === u.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </Button>
                      </div>

                      {/* Role & Status row */}
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <label className="text-[11px] text-muted-foreground font-medium block mb-1">রোল (Role)</label>
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
                        <div className="shrink-0 pb-1">
                          <label className="text-[11px] text-muted-foreground font-medium block mb-1">স্ট্যাটাস</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={u.is_active}
                              disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                              onChange={() => handleToggleStatus(u.id, u.is_active)}
                              className="size-4"
                            />
                            <span className={cn("text-xs font-medium", u.is_active ? "text-green-600" : "text-muted-foreground")}>
                              {u.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {total > size && (
          <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border pt-3 mt-1">
            <span className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              Total <span className="font-medium text-foreground">{total}</span> users
            </span>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 sm:px-3 gap-1"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="size-3 sm:size-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              <div className="text-xs sm:text-sm font-medium px-1">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 sm:px-3 gap-1"
                onClick={() => setPage(p => p + 1)}
                disabled={page * size >= total || isLoading}
              >
                Next
                <ChevronRight className="size-3 sm:size-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
