import { useState, type FormEvent } from "react"
import { authApi } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/http"
import type { UserResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, Loader2, Mail, Send, UserPlus, UserRound } from "lucide-react"

type FormValues = { name: string; email: string }
type FormState = "idle" | "submitting" | "success"

export function CreateMuftiDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState<FormValues>({ name: "", email: "" })
  const [formState, setFormState] = useState<FormState>("idle")
  const [createdUser, setCreatedUser] = useState<UserResponse | null>(null)
  const [error, setError] = useState("")

  function resetForm() {
    setForm({ name: "", email: "" })
    setFormState("idle")
    setCreatedUser(null)
    setError("")
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && !open) resetForm()
    onOpenChange(nextOpen)
  }

  function handleChange(field: keyof FormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const name = form.name.trim()
    const email = form.email.trim()

    if (name.length < 2) {
      setError("নাম অন্তত ২ অক্ষরের হতে হবে।")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("একটি সঠিক ইমেইল ঠিকানা দিন।")
      return
    }

    setFormState("submitting")
    try {
      const user = await authApi.createMufti({ name, email })
      setCreatedUser(user)
      setFormState("success")
      setForm({ name: "", email: "" })
    } catch (err) {
      setError(getApiErrorMessage(err))
      setFormState("idle")
    }
  }

  function handleCreateAnother() {
    setCreatedUser(null)
    setFormState("idle")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[93vw] max-w-md sm:max-w-[520px] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-popover p-0 shadow-2xl">
        {/* Header band */}
        <div className="relative border-b border-border bg-secondary/70 px-4 py-4 sm:px-6 sm:py-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
          <DialogHeader className="pr-8">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="inline-flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <UserPlus className="size-4 sm:size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">
                  অ্যাডমিন আমন্ত্রণ
                </p>
                <DialogTitle className="mt-0.5 font-heading text-lg sm:text-xl font-bold leading-tight">
                  মুফতি আমন্ত্রণ করুন
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="pt-1 text-xs sm:text-sm leading-relaxed">
              নতুন মুফতির জন্য অ্যাকাউন্ট তৈরি এবং পাসওয়ার্ড সেটআপের জন্য ইমেইল স্বয়ংক্রিয়ভাবে পাঠান
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Success state */}
        {formState === "success" && createdUser ? (
          <div className="animate-fade-rise p-4 sm:p-6">
            <div className="text-center">
              <span className="inline-flex size-14 sm:size-16 items-center justify-center rounded-full bg-accent text-primary ring-8 ring-accent/45">
                <CheckCircle2 className="size-7 sm:size-8" />
              </span>
              <h2 className="mt-4 sm:mt-5 font-heading text-base sm:text-lg font-bold">আমন্ত্রণ পাঠানো হয়েছে</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                এই মুফতির ইমেইলে পাসওয়ার্ড সেটআপ লিংকসহ ওয়েলকাম ইমেইল পাঠানো হয়েছে।
              </p>
              <p className="mt-3 break-all rounded-lg border border-border bg-muted px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-xs sm:text-sm font-medium text-foreground">
                {createdUser.email}
              </p>
            </div>

            <div className="mt-4 sm:mt-5 grid gap-2 rounded-lg border border-border bg-secondary/45 p-3 sm:p-4 text-xs sm:text-sm">
              <p><span className="font-medium">নাম:</span> {createdUser.name}</p>
              <p><span className="font-medium">ভূমিকা:</span> মুফতি</p>
              <p>
                <span className="font-medium">স্ট্যাটাস:</span>{" "}
                <span className="text-muted-foreground">
                  {createdUser.is_verified ? "যাচাইকৃত" : "পাসওয়ার্ড সেটআপের অপেক্ষায়"}
                </span>
              </p>
            </div>

            <div className="mt-4 sm:mt-5 flex flex-col-reverse sm:grid sm:grid-cols-2 gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCreateAnother}
                className="h-10 sm:h-11 w-full rounded-lg text-sm"
              >
                <UserPlus className="size-4" />
                আরেকজন
              </Button>
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-10 sm:h-11 w-full rounded-lg text-sm"
              >
                সম্পন্ন
              </Button>
            </div>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={handleSubmit} className="animate-fade-rise p-4 sm:p-6">
            {error && (
              <p className="mb-4 rounded-lg border border-destructive/25 bg-destructive/10 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="mufti-invite-name" className="text-xs sm:text-sm font-medium text-foreground">
                  পূর্ণ নাম
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="mufti-invite-name"
                    type="text"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    disabled={formState === "submitting"}
                    placeholder="মুফতির পূর্ণ নাম"
                    autoComplete="off"
                    autoFocus
                    className="h-10 sm:h-11 w-full rounded-lg border border-input bg-background pl-9 sm:pl-10 pr-3 text-sm outline-none transition placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mufti-invite-email" className="text-xs sm:text-sm font-medium text-foreground">
                  ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="mufti-invite-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    disabled={formState === "submitting"}
                    placeholder="mufti@example.com"
                    autoComplete="off"
                    className="h-10 sm:h-11 w-full rounded-lg border border-input bg-background pl-9 sm:pl-10 pr-3 text-sm outline-none transition placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:grid sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={formState === "submitting"}
                className="h-10 sm:h-11 w-full rounded-lg text-sm"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                disabled={formState === "submitting"}
                className="h-10 sm:h-11 w-full rounded-lg text-sm sm:text-base"
              >
                <span className="inline-flex size-4 items-center justify-center mr-1.5">
                  {formState === "submitting" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </span>
                আমন্ত্রণ পাঠান
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
