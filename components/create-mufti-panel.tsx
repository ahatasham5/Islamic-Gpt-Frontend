import { useState, type FormEvent } from "react"
import { authApi } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/http"
import type { UserResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, Mail, Menu, UserPlus } from "lucide-react"

type FormValues = { name: string; email: string }
type FormState = "idle" | "submitting" | "success"

export function CreateMuftiPanel({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu: () => void
}) {
  const [form, setForm] = useState<FormValues>({ name: "", email: "" })
  const [formState, setFormState] = useState<FormState>("idle")
  const [createdUser, setCreatedUser] = useState<UserResponse | null>(null)
  const [error, setError] = useState("")

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
      setError("Name must be at least 2 characters.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.")
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
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card/60 px-4 py-3.5 backdrop-blur md:px-6">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
          aria-label="মেনু খুলুন"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Admin
          </p>
          <h1 className="font-heading text-lg font-bold leading-tight md:text-xl">
            Create Mufti Account
          </h1>
        </div>
      </header>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
        <div className="mx-auto max-w-md">

          {/* Success state */}
          {formState === "success" && createdUser ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                <CheckCircle2 className="size-7" />
              </span>
              <h2 className="mt-4 font-heading text-lg font-bold">Mufti account created</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A welcome email with a password setup link has been sent to:
              </p>
              <p className="mt-2 rounded-lg bg-muted px-4 py-2 font-mono text-sm font-medium text-foreground">
                {createdUser.email}
              </p>
              <div className="mt-4 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left text-sm">
                <p><span className="font-medium">Name:</span> {createdUser.name}</p>
                <p className="mt-1"><span className="font-medium">Role:</span> {createdUser.role}</p>
                <p className="mt-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-muted-foreground">
                    {createdUser.is_verified ? "Verified" : "Pending password setup"}
                  </span>
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleCreateAnother}
                className="mt-5 w-full rounded-xl"
              >
                Create another Mufti
              </Button>
            </div>
          ) : (
            /* Form state */
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <UserPlus className="size-5" />
                </span>
                <div>
                  <h2 className="font-heading text-base font-bold">New Mufti</h2>
                  <p className="text-xs text-muted-foreground">
                    A welcome email with a password link will be sent automatically.
                  </p>
                </div>
              </div>

              {error ? (
                <p className="mb-4 rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="mufti-name" className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      id="mufti-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={formState === "submitting"}
                      placeholder="Mufti's full name"
                      autoComplete="off"
                      className="h-11 w-full rounded-xl border border-input bg-background px-10 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="mufti-email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="mufti-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={formState === "submitting"}
                      placeholder="mufti@example.com"
                      autoComplete="off"
                      className="h-11 w-full rounded-xl border border-input bg-background px-10 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={formState === "submitting"}
                  className="h-11 w-full rounded-xl text-base"
                >
                  <span className="inline-flex size-4 items-center justify-center">
                    {formState === "submitting" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <UserPlus className="size-4" />
                    )}
                  </span>
                  Create Mufti Account
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                The Mufti will receive a welcome email with a link to set their password.
                No password is required from you.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
