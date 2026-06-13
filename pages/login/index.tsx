import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { LoginScreen } from "@/components/login-screen"
import { useAuthContext } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

const roleHome: Record<UserRole, string> = {
  super_admin: "/admin",
  mufti: "/mufti",
  user: "/user",
}

export default function LoginPage() {
  const { session, isRestoring, isSubmitting, isVerifying, isResending, error, clearError, login, signup, verifyOtp, resendOtp, forgotPassword } =
    useAuthContext()
  const router = useRouter()

  // Already logged in — send to the right dashboard
  useEffect(() => {
    if (!isRestoring && session) {
      router.replace(roleHome[session.user.role])
    }
  }, [isRestoring, session, router])

  if (isRestoring || session) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#E8F5E6] via-[#D4EED1] to-white text-sm text-gray-700">
        Loading...
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>Login — ফতোয়া চ্যাট বট</title>
      </Head>
      <LoginScreen
        apiError={error}
        isSubmitting={isSubmitting}
        isVerifying={isVerifying}
        isResending={isResending}
        clearError={clearError}
        onLogin={async (payload) => {
          const session = await login(payload)
          router.replace(roleHome[session.user.role])
          return session
        }}
        onSignup={signup}
        onVerifyOtp={verifyOtp}
        onResendOtp={resendOtp}
        onForgotPassword={forgotPassword}
      />
    </>
  )
}
