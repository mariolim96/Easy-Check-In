"use client";

import { Plus, Pencil, User, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Apartment {
  id: string;
  name: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  bookings: Array<{ id: string }>;
}

interface Property {
  id: string;
  name: string;
  address: string;
  apartments: Apartment[];
}

interface ApartmentSectionProps {
  property: Property;
}

export function ApartmentSection({ property }: ApartmentSectionProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Apartments</h3>
        <Button className="flex items-center gap-1">
          <Plus size={16} />
          Add Apartment
        </Button>
      </div>

      <div className="grid gap-4">
        {property.apartments.map((apartment) => (
          <Card key={apartment.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h4 className="text-base font-medium">{apartment.name}</h4>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil size={16} />
                </Button>
              </div>

              <div className="mb-2 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-1.5">
                  <User size={16} className="text-muted-foreground" />
                  <span className="text-sm">{apartment.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bed size={16} className="text-muted-foreground" />
                  <span className="text-sm">{apartment.bedrooms} bed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath size={16} className="text-muted-foreground" />
                  <span className="text-sm">{apartment.bathrooms} bath</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {apartment.bookings.length} bookings
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end border-t pt-6">
        <Button>
          <Pencil size={16} className="mr-2" />
          Edit Property
        </Button>
      </div>
    </>
  );
}
