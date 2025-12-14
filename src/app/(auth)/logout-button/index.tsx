"use client";

import { logout } from "./action";
import { AuthActionButton } from "../action-button";
import { useRouter } from "next/navigation";

export default function LogOutButton() {
  const router = useRouter();

  return (
    <AuthActionButton
      variant="destructive"
      size="lg"
      successMessage="Logged out successfully!"
      action={async () => {
        try {
          await logout();
          router.push("/");
          return { error: null };
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          return { error: "Logout failed!" };
        }
      }}
    >
      Log Out
    </AuthActionButton>
  );
}
