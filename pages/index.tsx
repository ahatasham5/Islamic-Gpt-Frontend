import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuthContext } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

const roleHome: Record<UserRole, string> = {
  super_admin: "/admin",
  mufti: "/mufti",
  user: "/user",
}

/**
 * Root route — redirects to role dashboard if logged in, otherwise to /login.
 */
export default function RootPage() {
  const { session, isRestoring } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isRestoring) return
    if (session) {
      router.replace(roleHome[session.user.role])
    } else {
      router.replace("/login")
    }
  }, [isRestoring, session, router])

  return (
    <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
      Loading...
    </main>
  )
}
