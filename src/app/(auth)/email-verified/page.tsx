"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Home } from "@/routes";
import { verifyEmail } from "@/lib/auth-client";
import { toast } from "sonner";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid verification link");
      router.push("/");
      return;
    }

    const verifyUserEmail = async () => {
      debugger;
      try {
        await verifyEmail({ query: { token } });
        setIsVerifying(false);
        toast.success("Email verified successfully!");
      } catch (error) {
        toast.error("Failed to verify email");
        router.push("/");
      }
    };

    verifyUserEmail();
  }, [router, searchParams]);

  if (isVerifying) {
    return (
      <div className="flex grow flex-col items-center justify-center p-4">
        <p className="text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold text-green-500">
        Email Verified!
      </h1>
      <p className="mb-4 text-gray-600">
        Your email has been successfully verified.
      </p>
      <Home.Link
        className={buttonVariants({
          variant: "default",
        })}
      >
        Go to home
      </Home.Link>
    </div>
  );
}
