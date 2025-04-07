"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { signUp, useSession, sendVerificationEmail } from "@/lib/auth-client"; // Added useSession
import { AuthSignIn, Home } from "@/routes";
import { signUpSchema } from "@/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";


export default function SignUp() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "mario",
      email: "mario_996@hotmail.it",
      password: "Kakapato96@",
      confirmPassword: "Kakapato96@",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setPending(true);

      await signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
        },
        {
          onRequest: () => {
            setPending(true);
          },
          onSuccess: async () => {
            debugger;
            // Get the session after signup
            // const session = await useSession();

            // if (session?.data?.user) {
            // Send verification email
            try {
              await sendVerificationEmail({
                email: values.email,
                callbackURL: "/", // The redirect URL after verification
              });
              // await Encore.Mail.sendVerificationEmail({
              //   email: values.email,
              //   token: session.data.user., // Assuming the token is in the session
              //   callbackURL: window.location.origin, // Use current origin as callback URL
              // });

              toast.success("Successfully signed up!", {
                description:
                  "You have successfully signed up! Please check your email for verification.",
              });
            } catch (error) {
              console.error("Failed to send verification email:", error);
              toast.error(
                "Signup successful but failed to send verification email",
                {
                  description:
                    "Please try to resend the verification email later.",
                },
              );
            }

            router.push(Home());
            router.refresh();
          },
          onError: (ctx) => {
            toast.error("Something went wrong!", {
              description: ctx.error.message ?? "Something went wrong.",
            });
          },
        },
      );
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to sign up", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field.includes("password")
                              ? "password"
                              : field === "email"
                                ? "email"
                                : "text"
                          }
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button className="w-full" disabled={pending}>
                Sign up
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <AuthSignIn.Link className="text-primary hover:underline">
              Already have an account? Sign in
            </AuthSignIn.Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
