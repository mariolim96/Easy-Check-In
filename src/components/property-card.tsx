import { PropertyDetail } from "@/routes";

export function PropertyCard({ propertyId }: { propertyId: string }) {
  return (
    <PropertyDetail.Link propertyId={propertyId}>
      View Property Details
    </PropertyDetail.Link>
  );
}
