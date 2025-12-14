'use client'

import { ComponentProps } from "react";
import { ActionButton } from "@/components/ui/action-button";

export function AuthActionButton({
  action,
  successMessage,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  action: () => Promise<{ error: string | null; message?: string }>;
  successMessage?: string;
}) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const result = await action();

        if (result.error) {
   
          return {
            error: true,
            message: result.error || "Action failed",
          };
        }

        return {
          error: false,
          message: successMessage ?? result.message,
        };
      }}
    />
  );
}