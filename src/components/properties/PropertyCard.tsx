"use client";

import { Building2, MapPin, Key, User, Bed, Bath, Eye } from "lucide-react";
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
  hasSciaaLicense: boolean;
  apartments: Apartment[];
}

export function PropertyCard({ property }: { property: Property }) {
  const totalApartments = property.apartments.length;
  const totalBeds = property.apartments.reduce(
    (sum, apt) => sum + apt.bedrooms,
    0,
  );
  const totalBaths = property.apartments.reduce(
    (sum, apt) => sum + apt.bathrooms,
    0,
  );
  const maxGuests = property.apartments.reduce(
    (sum, apt) => sum + apt.maxGuests,
    0,
  );

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-r from-primary/10 to-primary/20">
        <Building2 className="h-24 w-24 text-primary/40" />
      </div>

      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-semibold">{property.name}</h3>

        <div className="mb-4 flex items-center text-sm text-muted-foreground">
          <MapPin size={16} className="mr-1" />
          <span>{property.address}</span>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="flex items-center gap-1.5">
            <Key size={16} className="text-muted-foreground" />
            <span className="text-sm">{totalApartments} apartments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={16} className="text-muted-foreground" />
            <span className="text-sm">Up to {maxGuests} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed size={16} className="text-muted-foreground" />
            <span className="text-sm">{totalBeds} beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={16} className="text-muted-foreground" />
            <span className="text-sm">{totalBaths} baths</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <PropertyDetail.Link propertyId={property.id}>
              <Button size="sm" variant="outline">
                <Eye size={16} className="mr-1" />
                View Details
              </Button>
            </PropertyDetail.Link>
            <Button size="sm" variant="ghost">
              Edit
            </Button>
          </div>

          {property.hasSciaaLicense && (
            <div className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-700">
              SCIA License
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
