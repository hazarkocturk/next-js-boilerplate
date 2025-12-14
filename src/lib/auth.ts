import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import {
  sendOrganizationInviteEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "./send-email";
import { createAuthMiddleware } from "better-auth/api";
import { organization, twoFactor } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { admin as adminPlugin } from "better-auth/plugins/admin"
import { ac, admin, user } from "./permissions"
import { member } from "./auth-schema";
import { and, desc, eq } from "drizzle-orm";
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { STRIPE_PLANS } from "./stripe";

// import { rateLimit } from "better-auth/plugins";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-11-17.clover", // Latest API version as of Stripe SDK v20.0.0
})

export const auth = betterAuth({
  appName: "next-js Boilerplate",
  baseURL: process.env.APP_URL ?? "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
     adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    organization({
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email,
        })
      },
    }),
   stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        authorizeReference: async ({ user, referenceId, action }) => {
          const memberItem = await db.query.member.findFirst({
            where: and(
              eq(member.organizationId, referenceId),
              eq(member.userId, user.id)
            ),
          })

          if (
            action === "upgrade-subscription" ||
            action === "cancel-subscription" ||
            action === "restore-subscription"
          ) {
            return memberItem?.role === "owner"
          }

          return memberItem != null
        },
        enabled: true,
        plans: STRIPE_PLANS,
      },
    }),
    // rateLimit({
    //       // Redis kullanıyorsan buraya client verebiliyorsun,
    //       // yoksa default in-memory de var ama prod için Redis tavsiye.
    //       window: 60 * 1000, // 1 dakika
    //       max: 5,            // 1 dakikada max 5 deneme
    //       keyGenerator: ({ req }) => {
    //         // Default: IP bazlı. İstersen header'dan da alabilirsin.
    //         const ip =
    //           req.headers.get("x-forwarded-for") ??
    //           req.headers.get("x-real-ip") ??
    //           "unknown";

    //         return ip;
    //       },
    //       // İstersen sadece bazı route/action'lara uygula:
    //       routes: [
    //         {
    //           // email/password login denemelerini sınırla
    //           path: "/api/auth/sign-in/email",
    //           max: 5,
    //           window: 60 * 1000,
    //         },
    //         {
    //           // signup için rate limit
    //           path: "/api/auth/sign-up/email",
    //           max: 3,
    //           window: 60 * 60 * 1000, // 1 saatte 3 kez
    //         },
    //       ],
    //     }),
  ],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendVerificationEmail({
          user: { ...user, email: newEmail },
          verificationLink: url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendVerificationEmail({ user, verificationLink: url });
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 5,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await sendPasswordResetEmail({ user, resetPasswordLink: url });
    },
  },

  emailVerification: {
    enabled: true,
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      await sendVerificationEmail({ user, verificationLink: url });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      maxAge: 60 * 60, // 1 hour
      enabled: true,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };
        if (user != null) {
          await sendWelcomeEmail(user);
        }
      }
    }),
  },
  databaseHooks: {
    session: {
      create: {
        before: async userSession => {
          const membership = await db.query.member.findFirst({
            where: eq(member.userId, userSession.userId),
            orderBy: desc(member.createdAt),
            columns: { organizationId: true },
          })

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          }
        },
      },
    },
  },
});
