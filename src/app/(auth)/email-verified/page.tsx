import { Suspense } from "react";
import EmailVerificationContent from "./email-verification-content";

export default function EmailVerifiedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex grow flex-col items-center justify-center p-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
}
