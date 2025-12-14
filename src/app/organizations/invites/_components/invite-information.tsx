"use client"

import { AuthActionButton } from "@/app/(auth)/action-button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function InviteInformation({
  invitation,
}: {
  invitation: { id: string; organizationId: string }
}) {
  const router = useRouter()

const acceptInvite = async (): Promise<{ error: string | null; message?: string }> => {
    const res = await authClient.organization.acceptInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: async () => {
          await authClient.organization.setActive({
            organizationId: invitation.organizationId,
          })
          router.push("/organizations")
        },
      }
    )

    if ("error" in res && res.error) {
      return { error: res.error.message ?? "Failed to accept invitation" }
    }

    return { error: null, message: "Invitation accepted" }
  }

  const rejectInvite = async (): Promise<{ error: string | null; message?: string }> => {
    const res = await authClient.organization.rejectInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: () => router.push("/"),
      }
    )

    if ("error" in res && res.error) {
      return { error: res.error.message ?? "Failed to reject invitation" }
    }

    return { error: null, message: "Invitation rejected" }
  }

  return (
    <div className="flex gap-4">
      <AuthActionButton className="grow" action={acceptInvite}>
        Accept
      </AuthActionButton>
      <AuthActionButton
        className="grow"
        variant="destructive"
        action={rejectInvite}
      >
        Reject
      </AuthActionButton>
    </div>
  )
}