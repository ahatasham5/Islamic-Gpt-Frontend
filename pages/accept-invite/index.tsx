import { useState, type FormEvent } from "react"
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
  Mail,
  ShieldCheck,
} from "lucide-react"

type PageState = "form" | "submitting" | "success" | "invalid-link"

/**
 * Shared full-page shell — scrollable, green gradient background,
 * consistent padding on all screen sizes, footer always below content.
 */
function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>{title} — ইসলামী প্রশ্নোত্তর</title>
      </Head>
      <main className="min-h-dvh bg-gradient-to-b from-[#E8F5E6] via-[#D4EED1] to-white flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-sm sm:max-w-md animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>

        {/* Footer — always below content, never overlapping */}
        <p className="mt-8 text-center text-[10px] sm:text-xs font-bold text-gray-500">
          © {new Date().getFullYear()} As-Sunnah Foundation. All rights reserved.
        </p>
      </main>
    </>
  )
}

/**
 * Shared brand header shown above every card.
 */
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

  const emailFromQuery =
    typeof router.query.email === "string"
      ? decodeURIComponent(router.query.email).trim()
      : ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pageState, setPageState] = useState<PageState>("form")
  const [formError, setFormError] = useState("")
  const [apiError, setApiError] = useState("")

  const visibleError = formError || apiError

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")
    setApiError("")

    if (!emailFromQuery) {
      setPageState("invalid-link")
      return
    }

    const result = acceptInviteSchema.safeParse({
      email: emailFromQuery,
      password,
      confirmPassword,
    })

    if (!result.success) {
      setFormError(getValidationMessage(result.error))
      return
    }

    setPageState("submitting")

    try {
      await authApi.acceptInvite({
        email: result.data.email,
        password: result.data.password,
      })
      setPageState("success")
    } catch (err) {
      setApiError(getApiErrorMessage(err))
      setPageState("form")
    }
  }

  // ── Invalid link ──────────────────────────────────────────────────────────
  if (pageState === "invalid-link" || (router.isReady && !emailFromQuery)) {
    return (
      <PageShell title="Invalid Invite Link">
        <BrandHeader />
        <div className="rounded-xl sm:rounded-2xl border-2 border-white/60 bg-white/30 p-5 sm:p-8 shadow-xl backdrop-blur-2xl text-center">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-800">
            Invalid invite link
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            This link is missing or malformed. Please ask your administrator to resend the invitation.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 w-full rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm border-2 border-[#64C859]/40 hover:bg-[#64C859]/10 cursor-pointer"
            onClick={() => router.replace("/login")}
          >
            Back to login
          </Button>
        </div>
      </PageShell>
    )
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <PageShell title="Account Activated">
        <BrandHeader />
        <div className="rounded-xl sm:rounded-2xl border-2 border-white/60 bg-white/30 p-5 sm:p-8 shadow-xl backdrop-blur-2xl text-center">
          <span className="inline-flex size-14 sm:size-16 items-center justify-center rounded-full bg-[#64C859]/20 text-[#64C859]">
            <CheckCircle2 className="size-7 sm:size-8" />
          </span>
          <h2 className="mt-4 font-heading text-lg sm:text-xl font-bold text-gray-800">
            Account activated
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            Your Mufti account is ready. You can now sign in with your email and the password you just set.
          </p>
          <Button
            type="button"
            className="mt-5 h-10 sm:h-11 w-full rounded-lg sm:rounded-xl text-sm bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer"
            onClick={() => router.replace("/login")}
          >
            Go to login
          </Button>
        </div>
      </PageShell>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  const isSubmitting = pageState === "submitting"

  return (
    <PageShell title="Set Your Password">
      <BrandHeader />

      <div className="rounded-xl sm:rounded-2xl border-2 border-white/60 bg-white/30 p-5 sm:p-8 shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-shadow duration-300">

        {/* Invite badge */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#64C859]/15 px-3 py-1 text-xs font-medium text-[#3a7a32]">
            <ShieldCheck className="size-3.5" />
            Mufti invitation
          </span>
        </div>

        <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-800 text-center">
          Set your password
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-700 text-center">
          Create a password to activate your Mufti account.
        </p>

        {/* Email — read-only from invite link */}
        <div className="mt-4 flex items-center gap-2 rounded-lg sm:rounded-xl border-2 border-[#64C859]/20 bg-white/20 px-3 py-2.5 backdrop-blur-sm">
          <Mail className="size-3.5 sm:size-4 shrink-0 text-gray-600" />
          <span className="truncate text-xs sm:text-sm font-medium text-gray-900">
            {emailFromQuery}
          </span>
        </div>

        {visibleError && (
          <p className="mt-3 rounded-lg sm:rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-xs sm:text-sm text-destructive">
            {visibleError}
          </p>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-800">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="h-11 w-full rounded-lg sm:rounded-xl border-2 border-[#64C859]/30 bg-white/20 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all duration-200 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#64C859] focus:bg-white/40 focus:ring-2 focus:ring-[#64C859]/25"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-medium text-gray-800">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="h-11 w-full rounded-lg sm:rounded-xl border-2 border-[#64C859]/30 bg-white/20 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all duration-200 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#64C859] focus:bg-white/40 focus:ring-2 focus:ring-[#64C859]/25"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p className={`text-xs font-medium ${password === confirmPassword ? "text-[#3a7a32]" : "text-destructive"}`}>
                {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg sm:rounded-xl text-sm font-semibold bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer"
          >
            {isSubmitting
              ? <Loader2 className="mr-2 size-4 animate-spin" />
              : null}
            Activate account
          </Button>
        </form>
      </div>
    </PageShell>
  )
}
