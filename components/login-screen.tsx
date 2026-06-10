"use client"

import { useState, type FormEvent } from "react"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import type { AuthSession } from "@/lib/types"
import type { LoginFormValues, OtpFormValues, SignupFormValues } from "@/lib/validation/auth"
import { getValidationMessage, loginSchema, otpSchema, resendOtpSchema, signupSchema } from "@/lib/validation/auth"
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Lock,
  Mail,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react"

const highlights = [
  {
    icon: MessageCircleQuestion,
    title: "Ask with clarity",
    desc: "Submit your question in Bangla or English and follow the cited sources.",
  },
  {
    icon: BookOpen,
    title: "Trusted references",
    desc: "Answers are grounded in the connected Islamic knowledge library.",
  },
  {
    icon: ShieldCheck,
    title: "Verified access",
    desc: "New accounts are confirmed with email OTP before sign in.",
  },
]

type AuthMode = "signin" | "signup" | "otp"

type LoginScreenProps = {
  apiError: string
  isSubmitting: boolean
  isVerifying: boolean
  isResending: boolean
  clearError: () => void
  onLogin: (payload: LoginFormValues) => Promise<AuthSession>
  onSignup: (payload: SignupFormValues) => Promise<void>
  onVerifyOtp: (payload: OtpFormValues) => Promise<unknown>
  onResendOtp: (email: string) => Promise<void>
}

export function LoginScreen({
  apiError,
  isSubmitting,
  isVerifying,
  isResending,
  clearError,
  onLogin,
  onSignup,
  onVerifyOtp,
  onResendOtp,
}: LoginScreenProps) {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [signinForm, setSigninForm] = useState<LoginFormValues>({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState<SignupFormValues>({ name: "", email: "", password: "" })
  const [otpForm, setOtpForm] = useState<OtpFormValues>({ email: "", otp: "" })
  const [formError, setFormError] = useState("")
  const [message, setMessage] = useState("")

  const visibleError = formError || apiError
  const isBusy = isSubmitting || isVerifying || isResending

  function resetFeedback() {
    setFormError("")
    setMessage("")
    clearError()
  }

  function switchMode(nextMode: AuthMode) {
    resetFeedback()
    setMode(nextMode)
  }

  async function handleSignin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    resetFeedback()

    const result = loginSchema.safeParse(signinForm)
    if (!result.success) {
      setFormError(getValidationMessage(result.error))
      return
    }

    try {
      await onLogin(result.data)
    } catch {
      // The auth hook exposes backend errors through apiError.
    }
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    resetFeedback()

    const result = signupSchema.safeParse(signupForm)
    if (!result.success) {
      setFormError(getValidationMessage(result.error))
      return
    }

    try {
      await onSignup(result.data)
      setOtpForm({ email: result.data.email, otp: "" })
      setMode("otp")
      setMessage("OTP sent to your email. Enter the 6-digit code to verify your account.")
    } catch {
      // The auth hook exposes backend errors through apiError.
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    resetFeedback()

    const result = otpSchema.safeParse(otpForm)
    if (!result.success) {
      setFormError(getValidationMessage(result.error))
      return
    }

    try {
      await onVerifyOtp(result.data)
      setSigninForm((current) => ({ ...current, email: result.data.email, password: "" }))
      setOtpForm({ email: result.data.email, otp: "" })
      setMode("signin")
      setMessage("Account verified. Please sign in with your email and password.")
    } catch {
      // The auth hook exposes backend errors through apiError.
    }
  }

  async function handleResendOtp() {
    resetFeedback()

    const result = resendOtpSchema.safeParse({ email: otpForm.email })
    if (!result.success) {
      setFormError(getValidationMessage(result.error))
      return
    }

    try {
      await onResendOtp(result.data.email)
      setMessage("A new OTP has been sent to your email.")
    } catch {
      // The auth hook exposes backend errors through apiError.
    }
  }

  return (
    <main className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <BrandMark size={48} />
          <div className="leading-tight">
            <p className="text-sm/5 text-primary-foreground/80">As-Sunnah Foundation</p>
            <p className="font-heading text-lg font-bold">Islamic GPT</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" />
            AI-powered knowledge assistant
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-tight">
            Reliable Islamic knowledge with verified access
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/85">
            Sign in to ask questions, review references, and continue your previous conversations.
          </p>

          <div className="mt-8 space-y-4">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-primary-foreground/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} As-Sunnah Foundation. All rights reserved.
        </p>
      </section>

      <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-background px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <BrandMark size={56} />
            <p className="mt-3 text-sm text-muted-foreground">As-Sunnah Foundation</p>
            <h1 className="font-heading text-2xl font-bold">Islamic GPT</h1>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            {mode === "otp" ? (
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back to sign up
              </button>
            ) : (
              <div className="mb-5 grid grid-cols-2 rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Sign up
                </button>
              </div>
            )}

            <h2 className="font-heading text-xl font-bold text-card-foreground">
              {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Verify OTP"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Use your registered email and password."
                : mode === "signup"
                  ? "Enter your details. We will send a 6-digit OTP to your email."
                  : `We sent an OTP to ${otpForm.email || "your email"}.`}
            </p>

            {visibleError ? (
              <p className="mt-4 rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                {visibleError}
              </p>
            ) : null}

            {message ? (
              <p className="mt-4 rounded-xl border border-primary/20 bg-accent px-3.5 py-2.5 text-sm text-foreground">
                {message}
              </p>
            ) : null}

            {mode === "signin" ? (
              <form className="mt-6 space-y-4" onSubmit={handleSignin}>
                <TextField
                  id="signin-email"
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={signinForm.email}
                  onChange={(value) => setSigninForm((current) => ({ ...current, email: value }))}
                  disabled={isBusy}
                  autoComplete="email"
                />
                <TextField
                  id="signin-password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={signinForm.password}
                  onChange={(value) => setSigninForm((current) => ({ ...current, password: value }))}
                  disabled={isBusy}
                  autoComplete="current-password"
                />

                <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full rounded-xl text-base">
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  Sign in
                </Button>
              </form>
            ) : null}

            {mode === "signup" ? (
              <form className="mt-6 space-y-4" onSubmit={handleSignup}>
                <TextField
                  id="signup-name"
                  label="Name"
                  type="text"
                  icon={User}
                  value={signupForm.name}
                  onChange={(value) => setSignupForm((current) => ({ ...current, name: value }))}
                  disabled={isBusy}
                  autoComplete="name"
                />
                <TextField
                  id="signup-email"
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={signupForm.email}
                  onChange={(value) => setSignupForm((current) => ({ ...current, email: value }))}
                  disabled={isBusy}
                  autoComplete="email"
                />
                <TextField
                  id="signup-password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={signupForm.password}
                  onChange={(value) => setSignupForm((current) => ({ ...current, password: value }))}
                  disabled={isBusy}
                  autoComplete="new-password"
                />

                <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full rounded-xl text-base">
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  Send OTP
                </Button>
              </form>
            ) : null}

            {mode === "otp" ? (
              <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
                <TextField
                  id="otp-email"
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={otpForm.email}
                  onChange={(value) => setOtpForm((current) => ({ ...current, email: value }))}
                  disabled={isBusy}
                  autoComplete="email"
                />
                <TextField
                  id="otp-code"
                  label="OTP"
                  type="text"
                  icon={ShieldCheck}
                  value={otpForm.otp}
                  onChange={(value) => setOtpForm((current) => ({ ...current, otp: value.replace(/\D/g, "").slice(0, 6) }))}
                  disabled={isBusy}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                />

                <Button type="submit" size="lg" disabled={isVerifying} className="h-11 w-full rounded-xl text-base">
                  {isVerifying ? <Loader2 className="size-4 animate-spin" /> : null}
                  Verify account
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isResending}
                  onClick={handleResendOtp}
                  className="h-10 w-full rounded-xl"
                >
                  {isResending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Resend OTP
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}

function TextField({
  id,
  label,
  type,
  icon: Icon,
  value,
  onChange,
  disabled,
  autoComplete,
  inputMode,
  maxLength,
}: {
  id: string
  label: string
  type: string
  icon: typeof Mail
  value: string
  onChange: (value: string) => void
  disabled: boolean
  autoComplete: string
  inputMode?: "email" | "numeric" | "search" | "tel" | "text" | "url"
  maxLength?: number
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          className="h-11 w-full rounded-xl border border-input bg-background px-10 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>
    </div>
  )
}
