import { z } from "zod"

// Regex for a strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.")

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  password: z.string().min(1, "Password is required."), // Don't enforce strength on login
})

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  password: strongPassword,
})

export const otpSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  otp: z.string().min(1, "OTP is required."),
})

export const resendOtpSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required."),
  new_password: strongPassword,
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.new_password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Invitation token is required."),
  password: strongPassword,
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type OtpFormValues = z.infer<typeof otpSchema>
export type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function getValidationMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Please fill in all required fields."
  }

  return "Please fill in all required fields."
}
