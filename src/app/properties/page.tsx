import { Suspense } from "react";
import { Metadata } from "next";
import { PropertiesHeader } from "@/components/properties/PropertiesHeader";
import { PropertyTabs } from "@/components/properties/PropertyTabs";

export const metadata: Metadata = {
  title: "Properties",
  description: "Manage your properties and apartments",
};

export default function PropertiesPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <PropertiesHeader />

      <Suspense fallback={<PropertyTabsSkeleton />}>
        <PropertyTabs />
      </Suspense>
    </div>
  );
}

function PropertyTabsSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="flex gap-2 border-b">
        <div className="h-10 w-32 animate-pulse rounded-md bg-muted"></div>
        <div className="h-10 w-32 animate-pulse rounded-md bg-muted"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border bg-card shadow-sm"
          >
            <div className="h-48 animate-pulse bg-muted"></div>
            <div className="space-y-4 p-6">
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-4 animate-pulse rounded bg-muted"
                  ></div>
                ))}
              </div>
              <div className="flex justify-between">
                <div className="h-8 w-32 animate-pulse rounded bg-muted"></div>
                <div className="h-8 w-24 animate-pulse rounded-full bg-muted"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
