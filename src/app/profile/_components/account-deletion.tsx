"use client";

import { AuthActionButton } from "@/app/(auth)/action-button";
import { authClient } from "@/lib/auth-client";

export function AccountDeletion() {
  const deleteAccount = async () => {
    const res = await authClient.deleteUser({
      callbackURL: "/",
    });

    if (res && "error" in res && res.error) {
      return {
        error: res.error.message ?? "Failed to initiate account deletion",
      };
    }

    return {
      error: null,
      message:
        "Account deletion initiated. Please check your email to confirm.",
    };
  };
  return (
    <AuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={deleteAccount}
    >
      Delete Account Permanently
    </AuthActionButton>
  );
}
