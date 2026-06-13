import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usersApi } from "@/lib/api/users"
import type { AuthSession } from "@/lib/types"
import { useAuthContext } from "@/lib/auth-context"
import { getApiErrorMessage } from "@/lib/http"
import { cn } from "@/lib/utils"
import { UserCog, ShieldCheck, Mail, User, Tag, Lock, KeyRound, Eye, EyeOff } from "lucide-react"

export function SettingsDialog({
  open,
  onOpenChange,
  session,
  defaultTab = "profile"
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: AuthSession
  defaultTab?: "profile" | "security"
}) {
  const { fetchSession } = useAuthContext()
  const [tab, setTab] = useState(defaultTab)
  
  useEffect(() => {
    if (open) {
      setTab(defaultTab)
    }
  }, [open, defaultTab])

  // Profile Form
  const [name, setName] = useState(session.user.name)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")

  // Security Form
  const [oldPassword, setOldPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordStep, setPasswordStep] = useState<"request" | "verify">("request")
  const [securityMessage, setSecurityMessage] = useState("")
  const [securityError, setSecurityError] = useState("")

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileMessage("")
    setProfileError("")
    try {
      await usersApi.updateProfile(name)
      await fetchSession()
      setProfileMessage("প্রোফাইল সফলভাবে আপডেট হয়েছে।")
    } catch (err) {
      setProfileError(getApiErrorMessage(err) || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  async function handleRequestPasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setIsChangingPassword(true)
    setSecurityMessage("")
    setSecurityError("")
    try {
      const res = await usersApi.requestPasswordChange(oldPassword)
      setPasswordStep("verify")
      setSecurityMessage(res.detail || "আপনার ইমেইলে একটি ওটিপি (OTP) পাঠানো হয়েছে।")
    } catch (err) {
      setSecurityError(getApiErrorMessage(err) || "পাসওয়ার্ড পরিবর্তনের অনুরোধ ব্যর্থ হয়েছে।")
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function handleVerifyPasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setIsChangingPassword(true)
    setSecurityMessage("")
    setSecurityError("")
    try {
      const res = await usersApi.verifyPasswordChange(otp, newPassword)
      setSecurityMessage(res.detail || "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।")
      setPasswordStep("request")
      setOldPassword("")
      setNewPassword("")
      setOtp("")
    } catch (err) {
      setSecurityError(getApiErrorMessage(err) || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।")
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 sm:p-8 pb-4">
          <DialogTitle className="font-heading text-xl font-bold">সেটিংস</DialogTitle>
          <DialogDescription className="text-sm">
            আপনার অ্যাকাউন্টের প্রোফাইল এবং নিরাপত্তা পরিচালনা করুন
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 sm:px-8">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-lg h-12">
              <TabsTrigger value="profile" className="rounded-md text-sm font-semibold h-full">
                <UserCog className="mr-2 size-4" />
                প্রোফাইল
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-md text-sm font-semibold h-full">
                <ShieldCheck className="mr-2 size-4" />
                নিরাপত্তা
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 pb-6 min-h-[320px]">
              <TabsContent value="profile" className="mt-0 outline-none space-y-4 animate-fade-rise">
                {/* <div className="mb-4 rounded-lg border border-border bg-secondary/45 p-4">
                  <div className="flex gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                      <UserCog className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-heading text-base font-bold">প্রোফাইল তথ্য</h2>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        আপনার ব্যক্তিগত তথ্য আপডেট করুন
                      </p>
                    </div>
                  </div>
                </div> */}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        ইমেইল এড্রেস
                      </label>
                      <Input id="email" value={session.user.email} disabled className="bg-muted/50 h-11 text-base" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Tag className="size-4 text-muted-foreground" />
                        রোল (Role)
                      </label>
                      <Input id="role" value={session.user.role} disabled className="bg-muted/50 h-11 text-base capitalize" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        আপনার নাম
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        required
                        className="h-11 text-base transition-colors focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>

                  {profileError && (
                    <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                      {profileError}
                    </p>
                  )}
                  {profileMessage && (
                    <p className="rounded-lg border border-green-600/25 bg-green-50 px-3.5 py-2.5 text-sm text-green-600">
                      {profileMessage}
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    className="h-11 text-base w-full rounded-lg font-medium" 
                    disabled={isUpdatingProfile || name === session.user.name}
                  >
                    {isUpdatingProfile ? "আপডেট হচ্ছে..." : "প্রোফাইল আপডেট করুন"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="security" className="mt-0 outline-none space-y-4 animate-fade-rise">
                <div className="mb-4 rounded-lg border border-border bg-secondary/45 p-4">
                  <div className="flex gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                      <ShieldCheck className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-heading text-base font-bold">পাসওয়ার্ড পরিবর্তন</h2>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {passwordStep === "request" 
                          ? "আপনার বর্তমান পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ডের জন্য ওটিপি (OTP) অনুরোধ করুন।"
                          : "ইমেইলে প্রাপ্ত ওটিপি (OTP) এবং নতুন পাসওয়ার্ড প্রদান করুন।"}
                      </p>
                    </div>
                  </div>
                </div>

                {passwordStep === "request" ? (
                  <form onSubmit={handleRequestPasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="old_password" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Lock className="size-4 text-muted-foreground" />
                        বর্তমান পাসওয়ার্ড
                      </label>
                      <div className="relative">
                        <Input
                          id="old_password"
                          type={showOldPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="আপনার বর্তমান পাসওয়ার্ড"
                          required
                          className="h-11 text-base transition-colors focus-visible:ring-primary/20 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showOldPassword ? "Hide password" : "Show password"}
                        >
                          {showOldPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </div>
                    </div>

                    {securityError && (
                      <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                        {securityError}
                      </p>
                    )}
                    {securityMessage && (
                      <p className="rounded-lg border border-green-600/25 bg-green-50 px-3.5 py-2.5 text-sm text-green-600">
                        {securityMessage}
                      </p>
                    )}

                    <Button 
                      type="submit" 
                      className="h-11 text-base w-full rounded-lg font-medium" 
                      disabled={isChangingPassword || !oldPassword}
                    >
                      {isChangingPassword ? "ওটিপি (OTP) পাঠানো হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন শুরু করুন"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="otp" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <KeyRound className="size-4 text-muted-foreground" />
                        ওটিপি (OTP)
                      </label>
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="ইমেইলে প্রাপ্ত ওটিপি"
                        required
                        className="h-11 text-base transition-colors focus-visible:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="new_password" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Lock className="size-4 text-muted-foreground" />
                        নতুন পাসওয়ার্ড
                      </label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="নতুন শক্তিশালী পাসওয়ার্ড"
                          required
                          className="h-11 text-base transition-colors focus-visible:ring-primary/20 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </div>
                    </div>

                    {securityError && (
                      <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                        {securityError}
                      </p>
                    )}
                    {securityMessage && (
                      <p className="rounded-lg border border-green-600/25 bg-green-50 px-3.5 py-2.5 text-sm text-green-600">
                        {securityMessage}
                      </p>
                    )}

                    <Button 
                      type="submit" 
                      className="h-11 text-base w-full rounded-lg font-medium" 
                      disabled={isChangingPassword || !otp || !newPassword}
                    >
                      {isChangingPassword ? "যাচাই করা হচ্ছে..." : "নতুন পাসওয়ার্ড নিশ্চিত করুন"}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
