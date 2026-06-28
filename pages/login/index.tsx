import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { LoginScreen } from "@/components/login-screen"
import { useAuthContext } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"

const roleHome: Record<UserRole, string> = {
  super_admin: "/admin",
  mufti: "/mufti",
  user: "/user",
}

export default function LoginPage() {
  const { session, isRestoring, isSubmitting, /*isVerifying, isResending,*/ error, clearError, login, /*signup, verifyOtp, resendOtp,*/ forgotPassword } =
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
        <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in-95 duration-700">
          <BrandMark size={80} className="animate-pulse" />
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-[#2E7D32]" />
            <p className="font-medium text-[#2E7D32] tracking-wide">দয়া করে অপেক্ষা করুন...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>Login — ইসলামী প্রশ্নোত্তর</title>
      </Head>
      <LoginScreen
        apiError={error}
        isSubmitting={isSubmitting}
        // isVerifying={isVerifying}
        // isResending={isResending}
        clearError={clearError}
        onLogin={async (payload) => {
          const session = await login(payload)
          sessionStorage.removeItem("activeChat")
          router.replace(roleHome[session.user.role])
          return session
        }}
        // onSignup={signup}
        // onVerifyOtp={verifyOtp}
        // onResendOtp={resendOtp}
        onForgotPassword={forgotPassword}
      />
    </>
  )
}
