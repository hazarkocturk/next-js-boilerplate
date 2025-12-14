"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
// import { signUp } from "../../signup-action";
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
import { authClient } from "@/lib/auth-client";
import { GoogleSignInButton } from "@/app/(auth)/google-button";
import { GithubSignInButton } from "@/app/(auth)/github-button";
import { Separator } from "@/components/ui/separator"
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type Props = {
  onSignUpSuccess?: (email: string) => void;
};

const SignUpTab = ({ onSignUpSuccess }: Props) => {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  //   const handleSignUp = async (data: SignUpForm) => {
  //     const formData = new FormData();
  //     formData.append("name", data.name);
  //     formData.append("email", data.email);
  //     formData.append("password", data.password);

  //     try {
  //       const res = await signUp(formData);

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
  //       form.setError("root", {
  //         type: "server",
  //         message: errorMessage,
  //       });
  //     }
  //   };

  const handleSignUp = async (data: SignUpForm) => {
    try {
      const res = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/", 
      });

      if (res.error) {
        // Arcjet veya Better Auth'tan gelen hata
        toast.error(res.error.message);
        return;
      }

      toast.success("Sign up successful!");
      form.reset();
      onSignUpSuccess?.(data.email);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast.error("Something went wrong.");
    }
  };
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Sign Up</LoadingSwap>
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
  );
};

export default SignUpTab;
