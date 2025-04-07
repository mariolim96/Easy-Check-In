"use client";

import { Key, User, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyDetail } from "@/routes";

interface Apartment {
  id: string;
  name: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
}

interface Property {
  id: string;
  name: string;
  address: string;
  has_sciaa_license: boolean;
  apartments: Apartment[];
}

interface ApartmentListProps {
  properties: Property[];
}

export function ApartmentList({ properties }: ApartmentListProps) {
  const apartments = properties.flatMap((property) =>
    property.apartments.map((apartment) => ({
      ...apartment,
      propertyId: property.id,
      propertyName: property.name,
    })),
  );

  if (!apartments.length) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
        <p className="text-muted-foreground">No apartments found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {apartments.map((apartment) => (
        <Card
          key={apartment.id}
          className="overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div className="relative flex h-40 items-center justify-center bg-gradient-to-r from-accent/10 to-accent/20">
            <Key className="h-20 w-20 text-accent-foreground/20" />
          </div>

          <CardContent className="p-6">
            <h3 className="mb-1 text-lg font-semibold">{apartment.name}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {apartment.propertyName}
            </p>

            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="flex items-center gap-1.5">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm">{apartment.maxGuests}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bed size={16} className="text-muted-foreground" />
                <span className="text-sm">{apartment.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath size={16} className="text-muted-foreground" />
                <span className="text-sm">{apartment.bathrooms}</span>
              </div>
            </div>

            <PropertyDetail.Link propertyId={apartment.propertyId}>
              <Button size="sm" variant="outline" className="w-full">
                View Details
              </Button>
            </PropertyDetail.Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
