"use client"

import { AuthActionButton } from "@/app/(auth)/action-button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function PasskeyButton() {
  const router = useRouter()
  const { refetch } = authClient.useSession()

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess() {
          refetch()
          router.push("/")
        },
      }
    )
  }, [router, refetch])

  return (
  <AuthActionButton
    variant="outline"
    className="w-full"
    action={async () => {
      const res = await authClient.signIn.passkey(undefined, {
        onSuccess() {
          refetch()
          router.push("/")
        },
      })
      if ("error" in res && res.error) {
        return {
          error: res.error.message ?? "Failed to delete passkey",
        }
      }

      return {
        error: null,
        message: "Passkey deleted successfully",
      }
    }}
  >
    Use Passkey
  </AuthActionButton>
  )
}