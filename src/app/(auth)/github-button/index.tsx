import { IconBrandGithub } from "@tabler/icons-react";
import { signInWithGithub } from "@/lib/auth-client";
import { AuthActionButton } from "../action-button";

export function GithubSignInButton() {
  return (
    <AuthActionButton
      variant="outline"
      successMessage="Redirecting to GitHub..."
      className="w-full flex items-center justify-center gap-2"
      action={async () => {
        try {
          await signInWithGithub();
          return { error: null };
        } catch {
          return { error: "GitHub sign-in failed. Please try again." };
        }
      }}
    >
      <IconBrandGithub className="h-4 w-4" />
      Sign in with GitHub
    </AuthActionButton>
  );
}
