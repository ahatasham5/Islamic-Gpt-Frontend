import { useState, type FormEvent } from "react"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import type { AuthSession } from "@/lib/types"
import type { LoginFormValues, OtpFormValues, SignupFormValues } from "@/lib/validation/auth"
import { getValidationMessage, loginSchema, otpSchema, resendOtpSchema, signupSchema } from "@/lib/validation/auth"
import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
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
    title: "স্পষ্টভাবে প্রশ্ন করুন",
    desc: "বাংলা বা ইংরেজিতে প্রশ্ন জমা দিন এবং উল্লেখিত সূত্র অনুসরণ করুন।",
  },
  {
    icon: BookOpen,
    title: "বিশ্বস্ত রেফারেন্স",
    desc: "ইসলামিক জ্ঞান লাইব্রেরির সাথে যুক্ত তথ্যসূত্র থেকে উত্তর প্রদান করা হয়।",
  },
  {
    icon: ShieldCheck,
    title: "যাচাইকৃত প্রবেশাধিকার",
    desc: "নতুন অ্যাকাউন্ট ইমেইল ওটিপি দিয়ে সাইন ইন করার আগে যাচাই করা হয়।",
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
    <main className="relative min-h-dvh overflow-hidden bg-white">

      {/* Background image */}
      <div 
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      <div className="relative grid min-h-dvh grid-cols-1 lg:grid-cols-[1.1fr_1fr]">

        {/* Left branding panel — sits over the green area */}
        <section className="hidden flex-col justify-center p-10 text-gray-500 lg:flex">
          {/* Islamic decorative border with lanterns */}
          <div className="pointer-events-none absolute inset-0 opacity-12">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <g id="lantern">
                  <ellipse cx="0" cy="1" rx="0.8" ry="0.4" fill="white" />
                  <rect x="-0.6" y="1" width="1.2" height="2" fill="white" />
                  <ellipse cx="0" cy="3" rx="0.8" ry="0.4" fill="white" />
                  <rect x="-0.3" y="0.3" width="0.6" height="0.7" fill="white" opacity="0.6" />
                  <line x1="0" y1="3.4" x2="0" y2="4" stroke="white" strokeWidth="0.1" />
                </g>
              </defs>
              
              {/* Top border with hanging lanterns */}
              <g transform="translate(10, 2)">
                <use href="#lantern" transform="scale(0.8)" />
              </g>
              <g transform="translate(30, 1.5)">
                <use href="#lantern" transform="scale(1)" />
              </g>
              <g transform="translate(50, 1)">
                <use href="#lantern" transform="scale(1.2)" />
              </g>
              <g transform="translate(70, 1.5)">
                <use href="#lantern" transform="scale(1)" />
              </g>
              <g transform="translate(90, 2)">
                <use href="#lantern" transform="scale(0.8)" />
              </g>
              
              {/* Top decorative wave */}
              <path d="M 0,5 Q 25,7 50,5 Q 75,3 100,5 L 100,0 L 0,0 Z" fill="white" opacity="0.15" />
              <path d="M 0,6 Q 20,8 40,6 Q 60,4 80,6 Q 90,7 100,6" fill="none" stroke="white" strokeWidth="0.2" opacity="0.3" />
              
              {/* Corner ornaments */}
              <circle cx="3" cy="3" r="1.5" fill="white" opacity="0.3" />
              <circle cx="97" cy="3" r="1.5" fill="white" opacity="0.3" />
              <circle cx="3" cy="97" r="1.5" fill="white" opacity="0.3" />
              <circle cx="97" cy="97" r="1.5" fill="white" opacity="0.3" />
              
              {/* Side decorative patterns */}
              <path d="M 0,20 Q 2,20 2,22 Q 2,24 0,24" fill="white" opacity="0.2" />
              <path d="M 0,40 Q 2,40 2,42 Q 2,44 0,44" fill="white" opacity="0.2" />
              <path d="M 0,60 Q 2,60 2,62 Q 2,64 0,64" fill="white" opacity="0.2" />
              <path d="M 0,80 Q 2,80 2,82 Q 2,84 0,84" fill="white" opacity="0.2" />
              
              <path d="M 100,20 Q 98,20 98,22 Q 98,24 100,24" fill="white" opacity="0.2" />
              <path d="M 100,40 Q 98,40 98,42 Q 98,44 100,44" fill="white" opacity="0.2" />
              <path d="M 100,60 Q 98,60 98,62 Q 98,64 100,64" fill="white" opacity="0.2" />
              <path d="M 100,80 Q 98,80 98,82 Q 98,84 100,84" fill="white" opacity="0.2" />
              
              {/* Bottom decorative wave */}
              <path d="M 0,95 Q 25,93 50,95 Q 75,97 100,95 L 100,100 L 0,100 Z" fill="white" opacity="0.15" />
            </svg>
          </div>
          
          {/* Falling stars and crescents animation */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              >
                <div className="relative">
                  {/* Tail effect */}
                  <div className="absolute left-1/2 top-0 h-12 w-0.5 -translate-x-1/2 bg-gradient-to-b from-white/60 to-transparent blur-sm" />
                  
                  {/* Main icon */}
                  <div className="relative opacity-70">
                    {i % 3 === 0 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-[0_0_16px_rgba(255,255,255,1)] [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.8))_drop-shadow(0_0_24px_rgba(255,255,255,0.6))]">
                        <path
                          d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"
                          fill="white"
                          fillOpacity="0.9"
                        />
                      </svg>
                    ) : i % 3 === 1 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-[0_0_16px_rgba(255,255,255,1)] [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.9))_drop-shadow(0_0_28px_rgba(255,255,255,0.5))]">
                        <path
                          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                          fill="white"
                          fillOpacity="0.85"
                        />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-[0_0_16px_rgba(255,255,255,1)] [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.9))_drop-shadow(0_0_28px_rgba(255,255,255,0.5))]">
                        <path
                          d="M20 12c-4.4 0-8 3.6-8 8 0-4.4-3.6-8-8-8 4.4 0 8-3.6 8-8 0 4.4 3.6 8 8 8z"
                          fill="white"
                          fillOpacity="0.85"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute left-10 top-10 flex items-center gap-3">
            <BrandMark size={48} />
            <div className="leading-tight">
              <p className="text-sm/5">As-Sunnah Foundation</p>
              <p className="font-heading text-lg font-bold">Islamic GPT</p>
            </div>
          </div>

          <div className="max-w-md space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" />
              এআই চালিত জ্ঞান সহায়ক
            </span>
            <h1 className="text-balance font-heading text-4xl font-bold leading-tight">
              বিশ্বাসযোগ্য ইসলামিক জ্ঞান যাচাইকৃত প্রবেশাধিকারে
            </h1>
            <p className="text-pretty leading-relaxed">
              প্রশ্ন করতে, রেফারেন্স পর্যালোচনা করতে এবং আপনার আগের কথোপকথন চালিয়ে যেতে সাইন ইন করুন।
            </p>

            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Right form panel — sits over the white area */}
        <section className="relative flex min-h-dvh items-center justify-center overflow-y-auto px-6 py-8">
          <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <BrandMark size={56} />
            <p className="mt-3 text-sm text-gray-700">As-Sunnah Foundation</p>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Islamic GPT</h1>
          </div>

          <div className="rounded-2xl border-2 border-white/40 bg-white/25 p-7 shadow-2xl backdrop-blur-xl">
            {mode === "otp" ? (
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-gray-900 cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                সাইন আপ এ ফিরে যান
              </button>
            ) : (
              <div className="mb-5 grid grid-cols-2 rounded-xl border border-white/30 bg-white/15 p-1 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                    mode === "signin" ? "bg-white/30 text-gray-900 shadow-sm backdrop-blur-sm border-2 border-[#64C859]" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  সাইন ইন
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                    mode === "signup" ? "bg-white/30 text-gray-900 shadow-sm backdrop-blur-sm border-2 border-[#64C859]" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  সাইন আপ
                </button>
              </div>
            )}

            <h2 className="font-heading text-xl font-bold text-gray-800 text-center">
              {mode === "signin" ? "আসসালামু আলাইকুম" : mode === "signup" ? "আপনার অ্যাকাউন্ট তৈরি করুন" : "ওটিপি যাচাই করুন"}
            </h2>
            <p className="mt-1 text-sm text-gray-700 text-center">
              {mode === "signin"
                ? "আপনার নিবন্ধিত ইমেইল এবং পাসওয়ার্ড ব্যবহার করুন।"
                : mode === "signup"
                  ? "আপনার বিবরণ লিখুন। আমরা আপনার ইমেইলে একটি ৬-সংখ্যার ওটিপি পাঠাব।"
                  : `আমরা ${otpForm.email || "আপনার ইমেইলে"} একটি ওটিপি পাঠিয়েছি।`}
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
                  label="ইমেইল"
                  type="email"
                  icon={Mail}
                  placeholder="আপনার ইমেইল"
                  value={signinForm.email}
                  onChange={(value) => setSigninForm((current) => ({ ...current, email: value }))}
                  disabled={isBusy}
                  autoComplete="email"
                />
                <TextField
                  id="signin-password"
                  label="পাসওয়ার্ড"
                  type="password"
                  icon={Lock}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  value={signinForm.password}
                  onChange={(value) => setSigninForm((current) => ({ ...current, password: value }))}
                  disabled={isBusy}
                  autoComplete="current-password"
                />

                <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full rounded-xl text-base bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer">
                  <span className="inline-flex size-4 items-center justify-center">
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  </span>
                  সাইন ইন
                </Button>
              </form>
            ) : null}

            {mode === "signup" ? (
              <form className="mt-6 space-y-4" onSubmit={handleSignup}>
                <TextField
                  id="signup-name"
                  label="নাম"
                  type="text"
                  icon={User}
                  placeholder="আপনার পুরো নাম"
                  value={signupForm.name}
                  onChange={(value) => setSignupForm((current) => ({ ...current, name: value }))}
                  disabled={isBusy}
                  autoComplete="name"
                />
                <TextField
                  id="signup-email"
                  label="ইমেইল"
                  type="email"
                  icon={Mail}
                  placeholder="আপনার ইমেইল"
                  value={signupForm.email}
                  onChange={(value) => setSignupForm((current) => ({ ...current, email: value }))}
                  disabled={isBusy}
                  autoComplete="email"
                />
                <TextField
                  id="signup-password"
                  label="পাসওয়ার্ড"
                  type="password"
                  icon={Lock}
                  placeholder="একটি পাসওয়ার্ড তৈরি করুন"
                  value={signupForm.password}
                  onChange={(value) => setSignupForm((current) => ({ ...current, password: value }))}
                  disabled={isBusy}
                  autoComplete="new-password"
                />

                <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full rounded-xl text-base bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer">
                  <span className="inline-flex size-4 items-center justify-center">
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  </span>
                  ওটিপি পাঠান
                </Button>
              </form>
            ) : null}

            {mode === "otp" ? (
              <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
                <TextField
                  id="otp-email"
                  label="ইমেইল"
                  type="email"
                  icon={Mail}
                  placeholder="আপনার ইমেইল"
                  value={otpForm.email}
                  onChange={(value) => setOtpForm((current) => ({ ...current, email: value }))}
                  disabled={isBusy}
                  autoComplete="email"
                />
                <TextField
                  id="otp-code"
                  label="ওটিপি"
                  type="text"
                  icon={ShieldCheck}
                  placeholder="৬-সংখ্যার কোড"
                  value={otpForm.otp}
                  onChange={(value) => setOtpForm((current) => ({ ...current, otp: value.replace(/\D/g, "").slice(0, 6) }))}
                  disabled={isBusy}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                />

                <Button type="submit" size="lg" disabled={isVerifying} className="h-11 w-full rounded-xl text-base bg-[#64C859] hover:bg-[#64C859]/90 cursor-pointer">
                  <span className="inline-flex size-4 items-center justify-center">
                    {isVerifying ? <Loader2 className="size-4 animate-spin" /> : null}
                  </span>
                  অ্যাকাউন্ট যাচাই করুন
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isResending}
                  onClick={handleResendOtp}
                  className="h-10 w-full rounded-xl cursor-pointer"
                >
                  <span className="inline-flex size-4 items-center justify-center">
                    {isResending ? <Loader2 className="size-4 animate-spin" /> : null}
                  </span>
                  পুনরায় ওটিপি পাঠান
                </Button>
              </form>
            ) : null}
          </div>
        </div>
        </section>

      </div>

      {/* Copyright footer - bottom center */}
      <div className="absolute bottom-0 left-0 right-0 pb-4 text-center">
        <p className="text-xs font-bold text-gray-500">
          © {new Date().getFullYear()} As-Sunnah Foundation. All rights reserved.
        </p>
      </div>
    </main>
  )
}

function TextField({
  id,
  label,
  type,
  icon: Icon,
  placeholder,
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
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
  autoComplete: string
  inputMode?: "email" | "numeric" | "search" | "tel" | "text" | "url"
  maxLength?: number
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border-2 border-white/40 bg-white/20 px-10 text-sm text-gray-900 placeholder:text-gray-600 outline-none transition backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-60 focus:border-white/60 focus:bg-white/30 focus:ring-2 focus:ring-white/30"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-gray-900"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : null}
      </div>
    </div>
  )
}
