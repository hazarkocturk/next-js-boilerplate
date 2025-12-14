"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function logout() {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
        return { success: true };
    } catch (error) {
        console.error("Logout failed:", error);
        throw new Error("Logout failed:");
    }

}