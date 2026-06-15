import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { usersApi } from "@/lib/api/users"
import { getApiErrorMessage } from "@/lib/http"
import { resetPasswordSchema, getValidationMessage } from "@/lib/validation/auth"
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react"

type PageState = "form" | "submitting" | "success" | "invalid-link"

// ── শেয়ার্ড লেআউট — কম্পোনেন্টের বাইরে সংজ্ঞায়িত ─────────────────────────
function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>{`${title} — ইসলামী প্রশ্নোত্তর`}</title>
      </Head>
      <main className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#E8F5E6] via-[#D4EED1] to-white flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl animate-in fade-in zoom-in-95 duration-500">
          {/* ব্র্যান্ড */}
          <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
            <BrandMark size={52} className="sm:hidden" />
            <BrandMark size={64} className="hidden sm:block" />
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-700">As-Sunnah Foundation</p>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Islamic GPT</h1>
          </div>

          {children}

          {/* ফুটার */}
          <p className="mt-6 text-center text-xs font-bold text-gray-500">
            © {new Date().getFullYear()} As-Sunnah Foundation. সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </main>
    </>
  )
}

export default function ResetPasswordPage() {
  const router = useRouter()

  const [tokenFromHash, setTokenFromHash] = useState("")
  const [isHashReady, setIsHashReady] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const token = params.get('token')
    if (token) {
      setTokenFromHash(token.trim())
    }
    setIsHashReady(true)
  }, [])

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pageState, setPageState] = useState<PageState>("form")
  const [formError, setFormError] = useState("")
  const [apiError, setApiError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const visibleError = formError || apiError

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")
    setApiError("")

    if (!tokenFromHash) {
      setPageState("invalid-link")
      return
    }

    const result = resetPasswordSchema.safeParse({
      token: tokenFromHash,
      new_password: password,
      confirmPassword,
    })

    if (!result.success) {
      setFormError(getValidationMessage(result.error))
      return
    }

    setPageState("submitting")

    try {
      const response = await usersApi.resetPassword({
        token: result.data.token,
        new_password: result.data.new_password,
      })
      setSuccessMsg(response.msg)
      setPageState("success")
    } catch (err) {
      setApiError(getApiErrorMessage(err))
      setPageState("form")
    }
  }

  // ── অবৈধ লিংক ────────────────────────────────────────────────────────────
  if (pageState === "invalid-link" || (isHashReady && !tokenFromHash)) {
    return (
      <PageShell title="অবৈধ রিসেট লিংক">
        <div className="rounded-2xl border-2 border-white/60 bg-white/30 p-6 sm:p-8 shadow-xl backdrop-blur-2xl text-center">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-800">রিসেট লিংকটি অবৈধ</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            লিংকটি অনুপস্থিত বা ত্রুটিপূর্ণ। অনুগ্রহ করে নতুন পাসওয়ার্ড রিসেট লিংকের জন্য অনুরোধ করুন।
          </p>
          <Button
            type="button"
            className="mt-5 sm:mt-6 h-10 sm:h-11 w-full rounded-xl text-sm sm:text-base font-bold bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer"
            onClick={() => router.replace("/login")}
          >
            লগইনে ফিরে যান
          </Button>
        </div>
      </PageShell>
    )
  }

  // ── সফলভাবে সম্পন্ন ──────────────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <PageShell title="পাসওয়ার্ড রিসেট সফল">
        <div className="rounded-2xl border-2 border-white/60 bg-white/30 p-6 sm:p-8 shadow-xl backdrop-blur-2xl text-center">
          <span className="inline-flex size-14 sm:size-16 items-center justify-center rounded-full bg-[#E8F5E6] text-[#64C859] mb-3 sm:mb-4">
            <CheckCircle2 className="size-7 sm:size-8" />
          </span>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-800">পাসওয়ার্ড রিসেট সফল হয়েছে</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">{successMsg}</p>
          <Button
            type="button"
            className="mt-5 sm:mt-6 h-10 sm:h-11 w-full rounded-xl text-sm sm:text-base bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer"
            onClick={() => router.replace("/login")}
          >
            লগইনে যান
          </Button>
        </div>
      </PageShell>
    )
  }

  // ── ফর্ম ──────────────────────────────────────────────────────────────────
  const isSubmitting = pageState === "submitting"

  return (
    <PageShell title="নতুন পাসওয়ার্ড সেট করুন">
      <div className="rounded-2xl border-2 border-white/60 bg-white/30 p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-shadow duration-300">
        <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-800 text-center">
          নতুন পাসওয়ার্ড সেট করুন
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-700 text-center mb-5 sm:mb-6">
          নিচে আপনার নতুন পাসওয়ার্ড লিখুন।
        </p>

        {visibleError && (
          <p className="mb-4 rounded-xl border border-destructive/25 bg-destructive/10 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-destructive">
            {visibleError}
          </p>
        )}

        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {/* নতুন পাসওয়ার্ড */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs sm:text-sm font-medium text-gray-800">
              নতুন পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="নতুন পাসওয়ার্ড লিখুন"
                autoComplete="new-password"
                className="h-10 sm:h-11 w-full rounded-xl border-2 border-[#64C859]/30 bg-white/20 pl-9 sm:pl-11 pr-9 sm:pr-10 text-xs sm:text-sm text-gray-900 placeholder:text-gray-600 outline-none transition-all duration-300 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#64C859] focus:bg-white/30 focus:ring-2 focus:ring-[#64C859]/30 overflow-hidden text-ellipsis"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-gray-900"
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* পাসওয়ার্ড নিশ্চিত করুন */}
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="text-xs sm:text-sm font-medium text-gray-800">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                autoComplete="new-password"
                className="h-10 sm:h-11 w-full rounded-xl border-2 border-[#64C859]/30 bg-white/20 pl-9 sm:pl-11 pr-9 sm:pr-10 text-xs sm:text-sm text-gray-900 placeholder:text-gray-600 outline-none transition-all duration-300 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#64C859] focus:bg-white/30 focus:ring-2 focus:ring-[#64C859]/30 overflow-hidden text-ellipsis"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-gray-900"
                aria-label={showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p className={`text-xs ${password === confirmPassword ? "text-[#64C859]" : "text-destructive"}`}>
                {password === confirmPassword ? "✓ পাসওয়ার্ড মিলেছে" : "✗ পাসওয়ার্ড মিলছে না"}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-10 sm:h-11 w-full rounded-xl text-sm sm:text-base bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer mt-1 sm:mt-2"
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            পাসওয়ার্ড রিসেট করুন
          </Button>
        </form>
      </div>
    </PageShell>
  )
}
