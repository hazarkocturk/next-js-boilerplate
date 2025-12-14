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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";


const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
 
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type Props = {
  openSignInTab?: () => void;
};

const ForgotPasswordTab = ({ openSignInTab }: Props) => {

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",   
    },
  });

const handleForgotPassword = async (data: ForgotPasswordForm) => {
  try {
    const res = await authClient.requestPasswordReset({
      ...data,   
    redirectTo: `/auth/reset-password`,
    });

    if (res.error) {
        toast.error(res.error.message || "Failed to send password reset email.");
    }

    toast.success("Password reset email sent!");
    form.reset();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    toast.error("Something went wrong.");
  }
};

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleForgotPassword)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Your Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 ">
            <Button variant="outline" className="flex-1" onClick={openSignInTab}>
              Back to Sign In
            </Button>
        <Button type="submit" className="flex-4" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Send Reset Email</LoadingSwap>
        </Button>
</div>
        {/* {form.formState.errors.root && (
          <p className="text-sm text-red-500 mt-2">
            {form.formState.errors.root.message}
          </p>
        )} */}
      </form>
    </Form>
  );
};

export default ForgotPasswordTab;
