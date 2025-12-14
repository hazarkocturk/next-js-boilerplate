"use client"

import { AuthActionButton } from "@/app/(auth)/action-button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { authClient } from "@/lib/auth-client"
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/o-auth-providers"
import { Plus, Shield, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number]

export function AccountLinking({
  currentAccounts,
}: {
  currentAccounts: Account[]
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Linked Accounts</h3>

        {currentAccounts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-secondary-muted">
              No linked accounts found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentAccounts.map(account => (
              <AccountCard
                key={account.id}
                provider={account.providerId}
                account={account}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Link Other Accounts</h3>
        <div className="grid gap-3">
          {SUPPORTED_OAUTH_PROVIDERS.filter(
            provider =>
              !currentAccounts.find(acc => acc.providerId === provider)
          ).map(provider => (
            <AccountCard key={provider} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AccountCard({
  provider,
  account,
}: {
  provider: string
  account?: Account
}) {
  const router = useRouter()

  const providerDetails =
    SUPPORTED_OAUTH_PROVIDER_DETAILS[provider as SupportedOAuthProvider] ?? {
      name: provider,
      Icon: Shield,
    }

  const linkAccount = async () => {
    const res = await authClient.linkSocial({
      provider,
      callbackURL: "/profile",
    })

    if (res && "error" in res && res.error) {
      return {
        error: res.error.message ?? "Failed to link account",
      }
    }

    return {
      error: null,
      message: "Redirecting to provider...",
    }
  }

  const unlinkAccount = async () => {
    if (!account) {
      return {
        error: "Account not found", 
      }
    }

    const res = await authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          router.refresh()
        },
      }
    )

    if (res && "error" in res && res.error) {
      return {
        error: res.error.message ?? "Failed to unlink account",
      }
    }

    return {
      error: null,
      message: "Account unlinked",
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <providerDetails.Icon className="size-5" />
            <div>
              <p className="font-medium">{providerDetails.name}</p>
              {account == null ? (
                <p className="text-sm text-muted-foreground">
                  Connect your {providerDetails.name} account for easier sign-in
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {account == null ? (
            <AuthActionButton
              variant="outline"
              size="sm"
              action={linkAccount}
            >
              <Plus />
              Link
            </AuthActionButton>
          ) : (
            <AuthActionButton
              variant="destructive"
              size="sm"
              action={unlinkAccount}
            >
              <Trash2 />
              Unlink
            </AuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
