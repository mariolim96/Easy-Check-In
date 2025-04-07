"use client";

import { Key, User, Bed, Bath } from "lucide-react";

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
  apartments: Apartment[];
}

interface PropertyStatsProps {
  property: Property;
}

export function PropertyStats({ property }: PropertyStatsProps) {
  const totalApartments = property.apartments.length;
  const totalBeds = property.apartments.reduce(
    (sum, apt) => sum + apt.bedrooms,
    0,
  );
  const totalBaths = property.apartments.reduce(
    (sum, apt) => sum + apt.bathrooms,
    0,
  );
  const totalGuests = property.apartments.reduce(
    (sum, apt) => sum + apt.maxGuests,
    0,
  );

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="flex flex-col items-center justify-center rounded-md border bg-background p-4">
        <Key size={20} className="mb-2 text-primary" />
        <span className="text-lg font-semibold">{totalApartments}</span>
        <span className="text-xs text-muted-foreground">Apartments</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-md border bg-background p-4">
        <User size={20} className="mb-2 text-primary" />
        <span className="text-lg font-semibold">{totalGuests}</span>
        <span className="text-xs text-muted-foreground">Max Guests</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-md border bg-background p-4">
        <Bed size={20} className="mb-2 text-primary" />
        <span className="text-lg font-semibold">{totalBeds}</span>
        <span className="text-xs text-muted-foreground">Bedrooms</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-md border bg-background p-4">
        <Bath size={20} className="mb-2 text-primary" />
        <span className="text-lg font-semibold">{totalBaths}</span>
        <span className="text-xs text-muted-foreground">Bathrooms</span>
      </div>
    </div>
  );
}
