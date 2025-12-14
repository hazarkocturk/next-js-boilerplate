import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { Loader2Icon } from "lucide-react"
import { headers } from "next/headers"
import { ReactNode, Suspense } from "react"
import { ChangePasswordForm } from "./change-password-form"
import { SetPasswordButton } from "./set-password-button"
import { Badge } from "@/components/ui/badge"
import { TwoFactorAuth } from "./two-factor-auth"
import { PasskeyManagement } from "./passkey-management"

export async function SecurityTab({
  email,
  isTwoFactorEnabled,
}: {
  email: string
  isTwoFactorEnabled: boolean
}) {

const accounts = await auth.api.listUserAccounts({ headers: await headers() })
const passkeys = await auth.api.listPasskeys({ headers: await headers() })
  const hasPasswordAccount = accounts.some(a => a.providerId === "credential")

  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will send you a password reset email to set up a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
        </Card>
      )}
      {hasPasswordAccount && (
        <Card>
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Two-Factor Authentication</CardTitle>
            <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          <PasskeyManagement passkeys={passkeys} />
        </CardContent>
      </Card>
    </div>
  )
}

export function LoadingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  )
}