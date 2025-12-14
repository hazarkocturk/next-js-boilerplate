"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
try {
    await auth.api.signUpEmail({
        body: { email, password, name },
        headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    console.error("Sign up failed:", error);
    throw new Error("Invalid email or password"); 
  }
 
}