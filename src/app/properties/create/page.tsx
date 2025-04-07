import { Suspense } from "react";
import { CreatePropertyForm } from "./CreatePropertyForm";
import { CreatePropertySkeleton } from "./loading";

export default function CreatePropertyPage() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<CreatePropertySkeleton />}>
        <CreatePropertyForm />
      </Suspense>
    </div>
  );
}
