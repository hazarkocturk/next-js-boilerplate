import { IconBrandGoogle } from "@tabler/icons-react";
import { signInWithGoogle } from "@/lib/auth-client";
import { AuthActionButton } from "../action-button";

export function GoogleSignInButton() {
  return (
    <AuthActionButton
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      successMessage="Redirecting to Google..."
      action={async () => {
        try {
          await signInWithGoogle();
          return { error: null};
        } catch {
          return { error: "Google sign-in failed. Please try again." };
        }
      }}
    >
      <IconBrandGoogle className="h-4 w-4" />
      Sign in with Google
    </AuthActionButton>
  );
}
