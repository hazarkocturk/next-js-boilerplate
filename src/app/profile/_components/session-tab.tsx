import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { SessionManagement } from "./session-management"

export async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string
}) {
  const sessions = await auth.api.listSessions({ headers: await headers(),
    // query: {
    //     disableCookieCache: true,
    //   },
    // aninda diger cihazlardaki oturumlari kapatmak icin buraya ekleyebilirsin,
    //  normalde browser db'ye sormak yerine cache'deb session kontrol eder
    // bu sekilde logout oldugunda diger cihazlardaki sessionlar da aninda kapanir
  })

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  )
}