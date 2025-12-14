"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { AuthActionButton } from "@/app/(auth)/action-button";
import { CreateInviteButton } from "./create-invite-button";
import { useRouter } from "next/navigation";

export function InvitesTab() {
  const router = useRouter();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const pendingInvites = activeOrganization?.invitations?.filter(
    (invite) => invite.status === "pending"
  );

  async function cancelInvitation(
    invitationId: string
  ): Promise<{ error: string | null; message?: string }> {
    const res = await authClient.organization.cancelInvitation({
      invitationId,
    });
    if ("error" in res && res.error) {
      return {
        error: res.error.message ?? "Failed to cancel invitation",
      };
    }
    router.refresh();
    return { error: null, message: "Invitation cancelled" };
  }

  return (
    <div className="space-y-4">
      <div className="justify-end flex">
        <CreateInviteButton />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingInvites?.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{invitation.role}</Badge>
              </TableCell>
              <TableCell>
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <AuthActionButton
                  variant="destructive"
                  size="sm"
                  action={() => cancelInvitation(invitation.id)}
                >
                  Cancel
                </AuthActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
