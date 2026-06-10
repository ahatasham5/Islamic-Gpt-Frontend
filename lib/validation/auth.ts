import { z } from "zod"

const emailSchema = z.string().trim().email("Enter a valid email address.")

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character.")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
})

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: emailSchema,
  password: passwordSchema,
})

export const otpSchema = z.object({
  email: emailSchema,
  otp: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit OTP."),
})

export const resendOtpSchema = z.object({
  email: emailSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type OtpFormValues = z.infer<typeof otpSchema>

export function getValidationMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Please check the form and try again."
  }

  return "Please check the form and try again."
}
