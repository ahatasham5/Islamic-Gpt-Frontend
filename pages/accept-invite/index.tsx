import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/http"
import { acceptInviteSchema, getValidationMessage } from "@/lib/validation/auth"
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react"

type PageState = "form" | "submitting" | "success" | "invalid-link"

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>{`${title} — ইসলামী প্রশ্নোত্তর`}</title>
      </Head>
      <main className="min-h-dvh bg-gradient-to-b from-[#E8F5E6] via-[#D4EED1] to-white flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-sm sm:max-w-md animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>
        <p className="mt-8 text-center text-[10px] sm:text-xs font-bold text-gray-500">
          © {new Date().getFullYear()} As-Sunnah Foundation. সর্বস্বত্ব সংরক্ষিত।
        </p>
      </main>
    </>
  )
}

function BrandHeader() {
  return (
    <div className="mb-5 sm:mb-7 flex flex-col items-center text-center">
      <BrandMark size={44} className="sm:hidden" />
      <BrandMark size={56} className="hidden sm:block" />
      <p className="mt-2 text-xs sm:text-sm text-gray-700">As-Sunnah Foundation</p>
      <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">Islamic GPT</h1>
    </div>
  )
}

export default function AcceptInvitePage() {
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

    const result = acceptInviteSchema.safeParse({
      token: tokenFromHash,
      password,
      confirmPassword,
    })

    if (!result.success) {
      setFormError(getValidationMessage(result.error))
      return
    }

    setPageState("submitting")

    try {
      const response = await authApi.acceptInvite({
        token: result.data.token,
        password: result.data.password,
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
      <PageShell title="অবৈধ আমন্ত্রণ লিংক">
        <BrandHeader />
        <div className="rounded-xl sm:rounded-2xl border-2 border-white/60 bg-white/30 p-5 sm:p-8 shadow-xl backdrop-blur-2xl text-center">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-800">
            আমন্ত্রণ লিংকটি অবৈধ
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            লিংকটি অনুপস্থিত বা ত্রুটিপূর্ণ। অনুগ্রহ করে আপনার অ্যাডমিনকে পুনরায় আমন্ত্রণ পাঠাতে বলুন।
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 w-full rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm border-2 border-[#64C859]/40 hover:bg-[#64C859]/10 cursor-pointer"
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
      <PageShell title="অ্যাকাউন্ট সক্রিয় হয়েছে">
        <BrandHeader />
        <div className="rounded-xl sm:rounded-2xl border-2 border-white/60 bg-white/30 p-5 sm:p-8 shadow-xl backdrop-blur-2xl text-center">
          <span className="inline-flex size-14 sm:size-16 items-center justify-center rounded-full bg-[#64C859]/20 text-[#64C859]">
            <CheckCircle2 className="size-7 sm:size-8" />
          </span>
          <h2 className="mt-4 font-heading text-lg sm:text-xl font-bold text-gray-800">
            অ্যাকাউন্ট সক্রিয় হয়েছে
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            {successMsg}
          </p>
          <Button
            type="button"
            className="mt-5 h-10 sm:h-11 w-full rounded-lg sm:rounded-xl text-sm bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer"
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
    <PageShell title="পাসওয়ার্ড সেট করুন">
      <BrandHeader />

      <div className="rounded-xl sm:rounded-2xl border-2 border-white/60 bg-white/30 p-5 sm:p-8 shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-shadow duration-300">

        {/* আমন্ত্রণ ব্যাজ */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#64C859]/15 px-3 py-1 text-xs font-medium text-[#3a7a32]">
            <ShieldCheck className="size-3.5" />
            মুফতি আমন্ত্রণ
          </span>
        </div>

        <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-800 text-center">
          আপনার পাসওয়ার্ড সেট করুন
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-700 text-center">
          মুফতি অ্যাকাউন্ট সক্রিয় করতে একটি পাসওয়ার্ড তৈরি করুন।
        </p>

        {visibleError && (
          <p className="mt-3 rounded-lg sm:rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-xs sm:text-sm text-destructive">
            {visibleError}
          </p>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>

          {/* পাসওয়ার্ড */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-800">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="পাসওয়ার্ড লিখুন"
                autoComplete="new-password"
                className="h-11 w-full rounded-lg sm:rounded-xl border-2 border-[#64C859]/30 bg-white/20 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all duration-200 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#64C859] focus:bg-white/40 focus:ring-2 focus:ring-[#64C859]/25"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* পাসওয়ার্ড নিশ্চিত করুন */}
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-medium text-gray-800">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                autoComplete="new-password"
                className="h-11 w-full rounded-lg sm:rounded-xl border-2 border-[#64C859]/30 bg-white/20 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all duration-200 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#64C859] focus:bg-white/40 focus:ring-2 focus:ring-[#64C859]/25"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                aria-label={showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p className={`text-xs font-medium ${password === confirmPassword ? "text-[#3a7a32]" : "text-destructive"}`}>
                {password === confirmPassword ? "✓ পাসওয়ার্ড মিলেছে" : "✗ পাসওয়ার্ড মিলছে না"}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg sm:rounded-xl text-sm font-semibold bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            অ্যাকাউন্ট সক্রিয় করুন
          </Button>
        </form>
      </div>
    </PageShell>
  )
}
