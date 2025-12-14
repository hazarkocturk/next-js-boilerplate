"use client"

import { AuthActionButton } from "@/app/(auth)/action-button"
import { authClient } from "@/lib/auth-client"

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <AuthActionButton
      variant="outline"
      successMessage="Password reset email sent"
      action={async () => {
        const res = await authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        })

        if ("error" in res && res.error) {
          return {
            error: res.error.message ?? "Failed to send password reset email",
          }
        }

        return {
          error: null,
          message:
            ("data" in res && res.data?.message) ||
            "Password reset email sent",
        }
      }}
    >
      Send Password Reset Email
    </AuthActionButton>
  )
}
