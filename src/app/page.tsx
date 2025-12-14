"use client"

import { AuthActionButton } from "@/app/(auth)/action-button"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [hasAdminPermission, setHasAdminPermission] = useState(false)
  const { data: session, isPending: loading } = authClient.useSession()

useEffect(() => {
  if (!session) {
    return
  }

  authClient.admin
    .hasPermission({ permission: { user: ["list"] } })
    .then(({ data }) => {
      setHasAdminPermission(data?.success ?? false)
    })
    .catch(() => setHasAdminPermission(false))
}, [session])

const role = session?.user?.role
const isAdmin = role === "admin"


  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session == null ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to Our App</h1>
            <Button asChild size="lg">
              <Link href="/auth/login">Sign In / Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome {session.user.name}!</h1>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/organizations">Organizations</Link>
              </Button>
              {hasAdminPermission && (
                <Button variant="outline" asChild size="lg">
                  <Link href="/admin">{isAdmin && hasAdminPermission ? "Admin" : "Users"}</Link>
                </Button>
              )}
              <AuthActionButton
                size="lg"
                variant="destructive"
                action={async () => {
                  try {
                    await authClient.signOut()
                    return { error: null }
                  } catch (err) {
                    return {
                      error: err instanceof Error ? err.message : 'Failed to sign out',
                      message: 'Sign out failed'
                    }
                  }
                }}
              >
                Sign Out
              </AuthActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}