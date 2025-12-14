import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { AccountLinking } from "./account-linking"

export async function LinkedAccountsTab() {
  const accounts = await auth.api.listUserAccounts({ headers: await headers() })
  const nonCredentialAccounts = accounts.filter(
    a => a.providerId !== "credential"
  )

  return (
    <Card>
      <CardContent>
        <AccountLinking currentAccounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  )
}