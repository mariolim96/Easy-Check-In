"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { AuthForgotPassword, Home } from "@/routes";
import { signInSchema } from "@/zod/zod";
import type { ErrorContext } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();

  const [pendingCredentials, setPendingCredentials] = useState(false);
  const [pendingGoogle, setPendingGoogle] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>,
  ) => {
    try {
      console.log("Attempting sign in with:", {
        email: values.email,
        baseUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      });

      await signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onRequest: () => {
            setPendingCredentials(true);
            console.log("Sign in request started");
          },
          onSuccess: async (response) => {
            console.log("Sign in successful:", response);
            router.push(Home());
            router.refresh();
            toast.success("Successfully signed in!", {
              description: "You have successfully signed in!",
            });
          },
          onError: (context: ErrorContext): void | Promise<void> => {
            console.error("Sign in error:", {
              error: context.error,
              status: context.response?.status,
              statusText: context.response?.statusText,
            });

            toast.error("Sign in failed", {
              description: `Error: ${context.error.message ?? "Unknown error"}. Status: ${context.response?.status}`,
            });
          },
        },
      );
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast.error("Sign in failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setPendingCredentials(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    if (pendingGoogle) return;

    await signIn.social(
      {
        provider: "google",
        // TypeScript doesn't recognize redirectUri, but we can use it with a type assertion
        // ...({
        //   redirectUri: "http://localhost:4000/api/auth/callback/google",
        // } as any),
      },
      {
        onRequest: () => {
          setPendingGoogle(true);
        },
        onSuccess: async () => {
          router.push(Home());
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          console.error("Google sign-in error:", ctx.error);
          toast.error("Something went wrong!", {
            description: JSON.stringify(ctx.error),
          });
        },
      },
    );
    setPendingGoogle(false);
  };

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCredentialsSignIn)}
              className="space-y-6"
            >
              {["email", "password"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signInSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={field === "password" ? "password" : "email"}
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete={
                            field === "password" ? "current-password" : "email"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button className="w-full">Sign in</Button>
            </form>
          </Form>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleSignInWithGoogle}
              disabled={pendingGoogle}
            >
              {pendingGoogle ? (
                <LoadingButton />
              ) : (
                <>
                  <SiGoogle className="mr-2 h-4 w-4" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <AuthForgotPassword.Link className="text-primary hover:underline">
              Forgot password?
            </AuthForgotPassword.Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ("use client");

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useState } from "react";
// import { Loader2, Key } from "lucide-react";
// import { signIn } from "@/lib/auth-client";
// import Link from "next/link";
// import { cn } from "@/lib/utils";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   return (
//     <Card className="max-w-md">
//       <CardHeader>
//         <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
//         <CardDescription className="text-xs md:text-sm">
//           Enter your email below to login to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4">
//           <div
//             className={cn(
//               "flex w-full items-center gap-2",
//               "flex-col justify-between",
//             )}
//           >
//             <Button
//               variant="outline"
//               className={cn("w-full gap-2")}
//               disabled={loading}
//               onClick={async () => {
//                 await signIn.social(
//                   {
//                     provider: "google",
//                     callbackURL: "/dashboard",
//                   },
//                   {
//                     onRequest: (ctx) => {
//                       setLoading(true);
//                     },
//                     onResponse: (ctx) => {
//                       setLoading(false);
//                     },
//                   },
//                 );
//               }}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="0.98em"
//                 height="1em"
//                 viewBox="0 0 256 262"
//               >
//                 <path
//                   fill="#4285F4"
//                   d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
//                 ></path>
//                 <path
//                   fill="#34A853"
//                   d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
//                 ></path>
//                 <path
//                   fill="#FBBC05"
//                   d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
//                 ></path>
//                 <path
//                   fill="#EB4335"
//                   d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
//                 ></path>
//               </svg>
//               Sign in with Google
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
