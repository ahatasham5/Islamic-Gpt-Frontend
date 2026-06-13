import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Shield, Users as UsersIcon, ChevronLeft, ChevronRight, UserCog, Ban, CheckCircle2 } from "lucide-react"
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
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>ব্যবহারকারী</DialogTitle>
          <DialogDescription>
            সকল ব্যবহারকারী, মুফতি এবং অ্যাডমিনদের পরিচালনা করুন।
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <UsersIcon className="mb-4 size-12 opacity-20" />
              <p>কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">নাম ও ইমেইল</th>
                    <th className="px-4 py-3 font-medium">রোল (Role)</th>
                    <th className="px-4 py-3 font-medium">স্ট্যাটাস</th>
                    <th className="px-4 py-3 font-medium text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => {
                    const isSelf = currentUserId === u.id
                    return (
                      <tr key={u.id} className="bg-card hover:bg-muted/20 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {u.name}
                            {isSelf && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary font-bold tracking-wider">You</span>}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                            {u.email}
                            {!u.is_verified && (
                              <span className="text-[10px] text-destructive border border-destructive/30 px-1 rounded-sm bg-destructive/5">Pending Verification</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            disabled={isSelf || isActioning === u.id || u.role === "super_admin"}
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            className="h-8 w-[130px] rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="user">User</option>
                            <option value="mufti">Mufti</option>
                            <option value="super_admin" disabled>Super Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
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
                        <td className="px-4 py-3 text-right">
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
          )}
        </div>

        {total > size && (
          <div className="shrink-0 flex items-center justify-between border-t border-border pt-4 mt-2">
            <span className="text-sm text-muted-foreground">
              Total {total} users
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * size >= total || isLoading}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
