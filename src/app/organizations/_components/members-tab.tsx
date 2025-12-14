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
import { useRouter } from "next/navigation";

export function MembersTab() {
  const router = useRouter();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();

  const myMember = activeOrganization?.members?.find(
  (m) => m.user.id === session?.user.id
)

const isOwner = myMember?.role === "owner"


  async function removeMember(
    memberId: string
  ): Promise<{ error: string | null; message?: string }> {
    const res = await authClient.organization.removeMember({
      memberIdOrEmail: memberId,
    });

    if ("error" in res && res.error) {
      return { error: res.error.message ?? "Failed to remove member" };
    }
    router.refresh();
    return { error: null, message: "Member removed" };
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeOrganization?.members?.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.user.name}</TableCell>
            <TableCell>{member.user.email}</TableCell>
            <TableCell>
              <Badge
                variant={
                  member.role === "owner"
                    ? "default"
                    : member.role === "admin"
                    ? "secondary"
                    : "outline"
                }
              >
                {member.role}
              </Badge>
            </TableCell>
            <TableCell>
              {isOwner && member.userId !== session?.user.id && (
                <AuthActionButton
                  requireAreYouSure
                  variant="destructive"
                  size="sm"
                  action={() => removeMember(member.id)}
                >
                  Remove
                </AuthActionButton>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
