"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "@/components/ui/password-input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const router = useRouter();
    const searchParam =useSearchParams();
    const token = searchParam.get("token");
    const error = searchParam.get("error");


  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

const handleResetPassword = async (data: ResetPasswordForm) => {
  if (token == null) return;

  try {
    const res = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (res.error) {
      toast.error(res.error.message || "Failed to reset password.");
      return;
    }

    toast.success("Password has been reset!");
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    toast.error("Something went wrong.");
  }
};


  const { isSubmitting } = form.formState;

  if(token==null || error !=null){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md p-6 mx-auto space-y-4">
            <CardHeader>
                <CardTitle className="text-center text-2xl mb-2">Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
        <p className="text-center text-red-500">Invalid or expired token. Please request a new password reset.</p>
         <Button className="w-full" asChild>
            <Link href="/auth/login">Back to Login</Link>
          </Button>
            </CardContent>
        </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full max-w-md p-6 mx-auto ">
        <CardHeader>
            <CardTitle className="text-center text-2xl mb-2">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleResetPassword)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Your Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit" className="flex-4" disabled={isSubmitting}>
            <LoadingSwap isLoading={isSubmitting}>Reset Password</LoadingSwap>
          </Button>

        {/* {form.formState.errors.root && (
          <p className="text-sm text-red-500 mt-2">
            {form.formState.errors.root.message}
          </p>
        )} */}
      </form>
    </Form>
        </CardContent>
    </Card>
    </div>
  );
};

export default ResetPassword;
