import { useRouter } from "next/router"
import { useEffect, type ComponentType } from "react"
import { useAuthContext } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

/**
 * HOC that protects a page by role.
 *
 * Usage:
 *   export default withAuth(MyPage, ["super_admin"])
 *   export default withAuth(MyPage, ["super_admin", "mufti", "user"])
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: UserRole[],
) {
  function ProtectedPage(props: P) {
    const { session, isRestoring } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
      if (isRestoring) return

      if (!session) {
        router.replace("/login")
        return
      }

      if (!allowedRoles.includes(session.user.role)) {
        // Redirect to the role's own dashboard
        const roleRedirects: Record<UserRole, string> = {
          super_admin: "/admin",
          mufti: "/mufti",
          user: "/user",
        }
        router.replace(roleRedirects[session.user.role])
      }
    }, [isRestoring, session, router])

    // Show nothing while restoring session or redirecting
    if (isRestoring || !session) {
      return (
        <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
          Loading...
        </main>
      )
    }

    if (!allowedRoles.includes(session.user.role)) {
      return (
        <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
          Redirecting...
        </main>
      )
    }

    return <WrappedComponent {...props} />
  }

  ProtectedPage.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`
  return ProtectedPage
}
