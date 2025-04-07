"use client";

import { PropertyCard } from "./PropertyCard";

interface Property {
  id: string;
  name: string;
  address: string;
  has_sciaa_license: boolean;
  apartments: Array<{
    id: string;
    name: string;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
  }>;
}

interface PropertyListProps {
  properties: Property[];
}

export function PropertyList({ properties }: PropertyListProps) {
  if (!properties.length) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
        <p className="text-muted-foreground">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={{
            ...property,
            hasSciaaLicense: property.has_sciaa_license,
          }}
        />
      ))}
    </div>
  );
}
