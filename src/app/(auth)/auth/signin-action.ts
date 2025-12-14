"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    console.error("Sign in failed:", error);
    throw new Error("Invalid email or password");
  }
}
