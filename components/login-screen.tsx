"use client"

import { useState, type FormEvent } from "react"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import type { MockSession, Role } from "@/lib/app-types"
import { BookOpen, MessageCircleQuestion, ShieldCheck, Sparkles } from "lucide-react"

const highlights = [
  {
    icon: MessageCircleQuestion,
    title: "প্রশ্ন করুন সহজে",
    desc: "বাংলা বা ইংরেজিতে আপনার প্রশ্ন লিখুন।",
  },
  {
    icon: BookOpen,
    title: "নির্ভরযোগ্য উৎস",
    desc: "প্রতিটি উত্তরের সাথে রেফারেন্স দেখুন।",
  },
  {
    icon: ShieldCheck,
    title: "প্রামাণিক জ্ঞান",
    desc: "আস-সুন্নাহ ফাউন্ডেশনের কিতাব থেকে।",
  },
]

export function LoginScreen({ onLogin }: { onLogin: (session: MockSession) => void }) {
  const [loginName, setLoginName] = useState("Demo User")
  const [loginRole, setLoginRole] = useState<Role>("reader")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onLogin({ name: loginName.trim() || "Demo User", role: loginRole })
  }

  return (
    <main className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      {/* Brand / hero panel */}
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
            <p className="font-heading text-lg font-bold">ফতোয়া চ্যাট বট</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" />
            AI-powered knowledge assistant
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-tight">
            ইসলামী জ্ঞানের নির্ভরযোগ্য সঙ্গী
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/85">
            প্রামাণিক কিতাব থেকে উত্তর খুঁজে নিন। প্রতিটি উত্তরের সাথে থাকছে
            স্পষ্ট রেফারেন্স ও প্রাসঙ্গিকতা।
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
          © {new Date().getFullYear()} As-Sunnah Foundation. সর্বস্বত্ব সংরক্ষিত।
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <BrandMark size={56} />
            <p className="mt-3 text-sm text-muted-foreground">As-Sunnah Foundation</p>
            <h1 className="font-heading text-2xl font-bold">ফতোয়া চ্যাট বট</h1>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-card-foreground">
              স্বাগতম
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              শুরু করতে নিচের তথ্য দিন।
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  নাম
                </label>
                <input
                  id="name"
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">ভূমিকা</label>
                <div className="grid grid-cols-2 gap-2">
                  <RoleOption
                    active={loginRole === "reader"}
                    label="ব্যবহারকারী"
                    desc="প্রশ্ন করুন"
                    onClick={() => setLoginRole("reader")}
                  />
                  <RoleOption
                    active={loginRole === "book_manager"}
                    label="Book manager"
                    desc="কিতাব ম্যানেজ"
                    onClick={() => setLoginRole("book_manager")}
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="h-11 w-full rounded-xl text-base">
                লগইন করুন
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            এটি একটি ডেমো লগইন — কোনো পাসওয়ার্ড প্রয়োজন নেই।
          </p>
        </div>
      </section>
    </main>
  )
}

function RoleOption({
  active,
  label,
  desc,
  onClick,
}: {
  active: boolean
  label: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border p-3 text-left transition ${
        active
          ? "border-primary bg-accent ring-2 ring-ring/30"
          : "border-input bg-background hover:border-ring/50 hover:bg-muted"
      }`}
    >
      <span className="block text-sm font-semibold text-foreground">{label}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
    </button>
  )
}
