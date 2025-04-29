"use client";

import { useAsync } from "react-use";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Home } from "@/routes";
import { verifyEmail } from "@/lib/auth-client";
import { toast } from "sonner";

export default function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state = useAsync(async () => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid verification link");
      void router.push("/");
      return;
    }

    await verifyEmail({ query: { token } });
    toast.success("Email verified successfully!");
    return true;
  }, [searchParams]);

  if (state.error) {
    toast.error("Failed to verify email:", {
      description: state.error.message,
    });
    void router.push("/");
    return null;
  }

  if (state.loading) {
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
