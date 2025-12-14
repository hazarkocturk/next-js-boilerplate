"use client"

import { authClient } from "@/lib/auth-client"
import { UserX } from "lucide-react"
import { AuthActionButton } from "../../(auth)/action-button"
import { useRouter } from "next/navigation"

export function ImpersonationIndicator() {
  const router = useRouter()
  const { data: session, refetch } = authClient.useSession()

  if (session?.session.impersonatedBy == null) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <AuthActionButton
        action={async () => {
          const result = await authClient.admin.stopImpersonating()
          if (result.error) {
            return { error: result.error.message || "Failed to stop impersonating" }
          }
          router.push("/admin")
          refetch()
          return { error: null }
        }}
        variant="destructive"
        size="sm"
      >
        <UserX className="size-4" />Stop Impersonating
      </AuthActionButton>
    </div>
  )
}