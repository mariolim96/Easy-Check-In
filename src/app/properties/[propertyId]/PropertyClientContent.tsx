"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Encore } from "@/lib/utils";
import { PropertyHeader } from "@/components/properties/detail/PropertyHeader";
import { PropertyStats } from "@/components/properties/detail/PropertyStats";
import { ApartmentSection } from "@/components/properties/detail/ApartmentSection";
import { PropertyDetail } from "@/routes";
import { useParams } from "@/routes/hooks";

// This component is not used in the current implementation
// It's kept as a reference for client-side data fetching if needed
export function PropertyClientContent() {
  const params = useParams(PropertyDetail);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", params.propertyId],
    queryFn: async () => {
      try {
        const response = await Encore.Property.getProperty({
          propertyId: params.propertyId,
        });

        // Enhance the data with mock fields - using a deterministic approach
        return {
          property: {
            ...response.property,
            apartments: response.property.apartments.map((apt, index) => ({
              ...apt,
              bedrooms: (index % 3) + 1, // 1, 2, or 3 bedrooms
              bathrooms: (index % 2) + 1, // 1 or 2 bathrooms
              bookings: Array(index % 5)
                .fill(null)
                .map((_, i) => ({ id: `booking-${i}` })),
            })),
          },
        };
      } catch {
        notFound();
      }
    },
  });

  if (isLoading) {
    return <PropertySkeleton />;
  }

  if (isError || !data) {
    notFound();
  }

  const { property } = data;

  return (
    <div className="animate-fade-in container mx-auto space-y-8 p-6">
      <PropertyHeader property={property} />
      <PropertyStats property={property} />
      <ApartmentSection property={property} />
    </div>
  );
}

function PropertySkeleton() {
  return (
    <div className="animate-fade-in container mx-auto space-y-8 p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-md border bg-background p-4"
          >
            <div className="mb-2 h-5 w-5 animate-pulse rounded-full bg-muted"></div>
            <div className="h-6 w-8 animate-pulse rounded bg-muted"></div>
            <div className="mt-1 h-4 w-20 animate-pulse rounded bg-muted"></div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-muted"></div>
          <div className="h-9 w-36 animate-pulse rounded bg-muted"></div>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="h-5 w-40 animate-pulse rounded bg-muted"></div>
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
              </div>

              <div className="mb-2 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-5 animate-pulse rounded bg-muted"
                  ></div>
                ))}
              </div>

              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
