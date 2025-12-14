"use client";

import { useState, useRef, useEffect } from "react";
import { AuthActionButton } from "@/app/(auth)/action-button";
import { authClient } from "@/lib/auth-client";

const COOLDOWN_SECONDS = 30;

const EmailVerificationTab = ({ email }: { email: string }) => {
  const [timeToNextResend, setTimeToNextResend] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearCooldownInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startCooldown(time = COOLDOWN_SECONDS) {
    // Önce var olan interval’i temizle
    clearCooldownInterval();

    setTimeToNextResend(time);

    intervalRef.current = setInterval(() => {
      setTimeToNextResend((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          clearCooldownInterval();
          return 0;
        }

        return newTime;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      clearCooldownInterval();
    };
  }, []);

  return (
    <div className="space-y-4">
      <p>Please check your email to verify your account.</p>
      <p>
        Verification email has been sent to:{" "}
        <span className="font-semibold">{email || "—"}</span>
      </p>

      <AuthActionButton
        className="w-full cursor-pointer"
        variant="outline"
        disabled={!email || timeToNextResend > 0}
        successMessage="Verification email resent. Please check your inbox."
        action={async () => {
          if (!email) {
            return { error: "Email is missing. Please sign up again." };
          }

          try {
            const res = await authClient.sendVerificationEmail?.({
              email,
              callbackURL: "/",
            });

            if (res && res.error) {
              return {
                error:
                  res.error.message ||
                  "Failed to resend verification email.",
              };
            }

            // SUCCESS → cooldown başlat
            startCooldown();
            return { error: null };
          } catch {
            return {
              error:
                "Failed to resend verification email. Please try again.",
            };
          }
        }}
      >
        {timeToNextResend > 0
          ? `Resend in ${timeToNextResend}s`
          : "Resend Verification Email"}
      </AuthActionButton>
    </div>
  );
};

export default EmailVerificationTab;
