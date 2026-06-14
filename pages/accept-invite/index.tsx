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

export default function AcceptInvitePage() {
  const router = useRouter()

  const emailFromQuery = typeof router.query.email === "string"
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
      <>
        <Head>
          <title>Invalid Invite Link — ইসলামী প্রশ্নোত্তর</title>
        </Head>
        <main className="grid min-h-screen place-items-center bg-background px-4 sm:px-6 py-8">
          <div className="w-full max-w-xs sm:max-w-sm text-center">
            <BrandMark size={48} className="mx-auto sm:hidden" />
            <BrandMark size={56} className="mx-auto hidden sm:block" />
            <h1 className="mt-4 sm:mt-5 font-heading text-lg sm:text-xl font-bold">Invalid invite link</h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              This link is missing or malformed. Please ask your administrator to resend the invitation.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 sm:mt-6 w-full rounded-xl h-10 sm:h-11 text-sm sm:text-base"
              onClick={() => router.replace("/login")}
            >
              Back to login
            </Button>
          </div>
        </main>
      </>
    )
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <>
        <Head>
          <title>Account Activated — ইসলামী প্রশ্নোত্তর</title>
        </Head>
        <main className="grid min-h-screen place-items-center bg-background px-4 sm:px-6 py-8">
          <div className="w-full max-w-xs sm:max-w-sm text-center">
            <span className="inline-flex size-14 sm:size-16 items-center justify-center rounded-full bg-accent text-primary">
              <CheckCircle2 className="size-7 sm:size-8" />
            </span>
            <h1 className="mt-4 sm:mt-5 font-heading text-lg sm:text-xl font-bold">Account activated</h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Your Mufti account is ready. You can now sign in with your email and the password you just set.
            </p>
            <Button
              type="button"
              className="mt-5 sm:mt-6 h-10 sm:h-11 w-full rounded-xl text-sm sm:text-base"
              onClick={() => router.replace("/login")}
            >
              Go to login
            </Button>
          </div>
        </main>
      </>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  const isSubmitting = pageState === "submitting"

  return (
    <>
      <Head>
        <title>Set Your Password — ইসলামী প্রশ্নোত্তর</title>
      </Head>
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">

        {/* Left decorative panel — desktop only */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-8 xl:p-10 text-primary-foreground lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <BrandMark size={44} />
            <div className="leading-tight">
              <p className="text-sm/5 text-primary-foreground/80">As-Sunnah Foundation</p>
              <p className="font-heading text-lg font-bold">Islamic GPT</p>
            </div>
          </div>

          <div className="relative max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="size-3.5" />
              Mufti invitation
            </span>
            <h1 className="mt-5 text-balance font-heading text-3xl xl:text-4xl font-bold leading-tight">
              You have been invited as a Mufti
            </h1>
            <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/85 text-sm xl:text-base">
              Set a password to activate your account and start using the Islamic GPT platform.
            </p>
          </div>

          <p className="relative text-xs text-primary-foreground/70">
            © {new Date().getFullYear()} As-Sunnah Foundation. All rights reserved.
          </p>
        </section>

        {/* Right form panel */}
        <section className="flex min-h-screen items-center justify-center overflow-y-auto bg-background px-4 sm:px-6 py-8 sm:py-10">
          <div className="w-full max-w-xs sm:max-w-sm">

            {/* Mobile brand — hidden on lg+ */}
            <div className="mb-6 sm:mb-8 flex flex-col items-center text-center lg:hidden">
              <BrandMark size={48} className="sm:hidden" />
              <BrandMark size={56} className="hidden sm:block" />
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">As-Sunnah Foundation</p>
              <h1 className="font-heading text-xl sm:text-2xl font-bold">Islamic GPT</h1>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-7 shadow-sm">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-card-foreground">
                Set your password
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Create a password to activate your Mufti account.
              </p>

              {/* Email — read-only from invite link */}
              <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-2.5 rounded-xl border border-border bg-muted/50 px-3 sm:px-3.5 py-2 sm:py-2.5">
                <Mail className="size-3.5 sm:size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-xs sm:text-sm font-medium text-foreground">
                  {emailFromQuery}
                </span>
              </div>

              {visibleError && (
                <p className="mt-3 sm:mt-4 rounded-xl border border-destructive/25 bg-destructive/10 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-destructive">
                  {visibleError}
                </p>
              )}

              <form className="mt-4 sm:mt-5 space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs sm:text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background pl-9 sm:pl-10 pr-9 sm:pr-10 text-xs sm:text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirm-password" className="text-xs sm:text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background pl-9 sm:pl-10 pr-9 sm:pr-10 text-xs sm:text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p className={`text-xs ${password === confirmPassword ? "text-primary" : "text-destructive"}`}>
                      {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-10 sm:h-11 w-full rounded-xl text-sm sm:text-base mt-1"
                >
                  {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Activate account
                </Button>
              </form>
            </div>

            {/* Mobile footer */}
            <p className="mt-5 text-center text-xs text-muted-foreground lg:hidden">
              © {new Date().getFullYear()} As-Sunnah Foundation. All rights reserved.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
