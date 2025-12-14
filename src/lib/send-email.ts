// src/lib/mail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL!;

export type VerificationEmailPayload = {
  user: {
    email: string;
    name?: string | null;
  };
  verificationLink: string;
};

export type ResetPasswordEmailPayload = {
  user: {
    email: string;
    name?: string | null;
  };
  resetPasswordLink: string;
};

export async function sendVerificationEmail({
  user,
  verificationLink,
}: VerificationEmailPayload) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Verify your email address",
    html: `
      <p>Hi ${user.name ?? ""},</p>
      <p>Thanks for signing up. Please verify your email by clicking the link below:</p>
      <p><a href="${verificationLink}">Verify your email</a></p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail({
  user,
  resetPasswordLink,
}: ResetPasswordEmailPayload) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Reset your password",
    html: `
      <p>Hi ${user.name ?? ""},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetPasswordLink}">Reset your password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendWelcomeEmail(user: { email: string; name?: string | null }) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Welcome to Our Service!",
    html: `
      <p>Hi ${user.name ?? ""},</p>
      <p>Welcome to our service! We're excited to have you on board.</p>
      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
      <p>Best regards,<br/>The Team</p>
    `,
  });
}

export async function sendOrganizationInviteEmail({
  invitation,
  inviter,
  organization,
  email,
}: {
  invitation: { id: string }
  inviter: { name: string }
  organization: { name: string }
  email: string
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You're invited to join the ${organization.name} organization`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You're invited to join ${organization.name}</h2>
        <p>Hello ${inviter.name},</p>
        <p>${inviter.name} invited you to join the ${organization.name} organization. Please click the button below to accept/reject the invitation:</p>
        <a href="${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Manage Invitation</a>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `You're invited to join the ${organization.name} organization\n\nHello ${inviter.name},\n\n${inviter.name} invited you to join the ${organization.name} organization. Please click the link below to accept/reject the invitation:\n\n${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}\n\nBest regards,\nYour App Team`,
  })
}

