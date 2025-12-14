"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
// import { signIn } from "../../signin-action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { GoogleSignInButton } from "@/app/(auth)/google-button";
import { GithubSignInButton } from "@/app/(auth)/github-button";
import { Separator } from "@/components/ui/separator";
import { PasskeyButton } from "@/app/profile/_components/passkey-button";

const signInSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignInForm = z.infer<typeof signInSchema>;
type Props = {
  onSignInSuccess?: (email: string) => void;
  openForgotPasswordTab?: () => void;
};

const SignInTab = ({ onSignInSuccess, openForgotPasswordTab }: Props) => {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  //   const handleSignIn = async (data: SignInForm) => {
  //     const formData = new FormData();

  //     formData.append("email", data.email);
  //     formData.append("password", data.password);

  //     try {
  //       const res = await signIn(formData);

  //       if (res?.success) {
  //         toast.success(
  //           "Sign up successful! Please check your email to verify your account."
  //         );
  //         form.reset();
  //         router.push("/");
  //       }
  //     } catch (error: unknown) {
  //       const errorMessage =
  //         error instanceof Error ? error.message : "Something went wrong";
  //           toast.error(errorMessage);
  //     //   form.setError("root", {
  //     //     type: "server",
  //     //     message: errorMessage,
  //     //   });
  //     }
  //   };

  const handleSignIn = async (data: SignInForm) => {
    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/", // opsiyonel, istersen kaldırıp sadece router.push kullanabilirsin
      });

      if (res.error) {
        const code = res.error.code;

        if (code === "EMAIL_NOT_VERIFIED") {
          onSignInSuccess?.(data.email);
          toast.message("Please verify your email to continue.");
          return;
        }
        toast.error(res.error.message ?? "Invalid email or password");
        return;
      }

      toast.success("Login successful!");
      form.reset();
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast.error("Something went wrong.");
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    autoComplete="email webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>Password</FormLabel>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="float-right -mt-1"
                    onClick={openForgotPasswordTab}
                  >
                    Forgot Password?
                  </Button>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="Your Password"
                    autoComplete="current-password webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
          </Button>
          <Separator />
          <GoogleSignInButton />
          <GithubSignInButton />
          {/* {form.formState.errors.root && (
          <p className="text-sm text-red-500 mt-2">
            {form.formState.errors.root.message}
          </p>
        )} */}
        </form>
      </Form>
      <PasskeyButton />
    </div>
  );
};

export default SignInTab;
