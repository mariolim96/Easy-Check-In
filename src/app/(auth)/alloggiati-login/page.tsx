"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Cookies from "js-cookie";

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
import { Home } from "@/routes";
import { Encore } from "@/lib/utils";

const alloggiatiLoginSchema = z.object({
  Utente: z.string().min(1, "Username is required"),
  Password: z.string().min(1, "Password is required"),
  WsKey: z.string().min(1, "WsKey is required"),
});

type AlloggiatiLoginForm = z.infer<typeof alloggiatiLoginSchema>;

export default function AlloggiatiLogin() {
  const router = useRouter();

  const form = useForm<AlloggiatiLoginForm>({
    resolver: zodResolver(alloggiatiLoginSchema),
    defaultValues: {
      Utente: "",
      Password: "",
      WsKey: "",
    },
  });

  const onSubmit = async (values: AlloggiatiLoginForm) => {
    try {
      const response = await Encore.Alloggiati.generateToken(values);

      if (response.error) {
        toast.error("Login failed", {
          description: response.error,
        });
        return;
      }

      // Store the token in cookies
      Cookies.set("alloggiati_token", response.token, {
        expires: 7, // 7 days
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("alloggiati_expires", response.expires, {
        expires: 7,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("alloggiati_user", values.Utente, {
        expires: 7,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      toast.success("Login successful", {
        description: "You have successfully logged in to Alloggiati service",
      });

      router.push(Home());
      router.refresh();
    } catch (error) {
      toast.error("Login failed", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Alloggiati Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="Utente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="WsKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WS Key</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
