import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Encore } from "@/lib/utils";
import { PropertyHeader } from "@/components/properties/detail/PropertyHeader";
import { PropertyStats } from "@/components/properties/detail/PropertyStats";
import { ApartmentSection } from "@/components/properties/detail/ApartmentSection";

export async function generateMetadata(props: {
  params: { propertyId: string };
}): Promise<Metadata> {
  try {
    // Use dynamic import to ensure params are properly resolved in PPR mode
    const { params } = props;
    const propertyId = params.propertyId;

    const response = await Encore.Property.getProperty({
      propertyId,
    });

    return {
      title: response.property.name,
      description: `Manage ${response.property.name} and its apartments`,
    };
  } catch (error) {
    return {
      title: "Property Details",
      description: "View and manage property details",
    };
  }
}

async function getProperty(propertyId: string) {
  try {
    const response = await Encore.Property.getProperty({
      propertyId,
    });

    // Enhance the data with mock fields - using a deterministic approach
    // to avoid client/server mismatch
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
  } catch (error) {
    notFound();
  }
}

export default async function PropertyPage(props: {
  params: { propertyId: string };
}) {
  // Use dynamic import to ensure params are properly resolved in PPR mode
  const { params } = props;
  const propertyId = params.propertyId;

  // Now we can safely use propertyId
  const data = await getProperty(propertyId);
  const { property } = data;

  return (
    <div className="animate-fade-in container mx-auto space-y-8 p-6">
      <PropertyHeader property={property} />

      <Suspense fallback={<PropertyStatsSkeleton />}>
        <PropertyStats property={property} />
      </Suspense>

      <Suspense fallback={<ApartmentSectionSkeleton />}>
        <ApartmentSection property={property} />
      </Suspense>
    </div>
  );
}

function PropertyStatsSkeleton() {
  return (
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
  );
}

function ApartmentSectionSkeleton() {
  return (
    <>
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
    </>
  );
}
