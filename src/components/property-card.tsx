import { PropertyDetail } from "@/routes";
import { Button } from "@/components/ui/button";

export function PropertyCard({ propertyId }: { propertyId: string }) {
  return (
    <PropertyDetail.Link propertyId={propertyId}>
      <Button variant="secondary" className="w-full">
        View Details
      </Button>
    </PropertyDetail.Link>
  );
}
