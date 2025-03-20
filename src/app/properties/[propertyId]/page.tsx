"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Key,
  Bed,
  Bath,
  User,
  Plus,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Properties } from "@/routes";
import { Encore } from "@/lib/utils";
import { useParams, usePush } from "@/routes/hooks";
import { PropertyDetail } from "@/routes";

// Mock data structure
interface Apartment {
  id: string;
  name: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  bookings: Array<{ id: string }>;
}

interface PropertyData {
  id: string;
  name: string;
  address: string;
  has_sciaa_license: boolean;
  apartments: Apartment[];
}

export default function PropertyPage() {
  const params = useParams(PropertyDetail);
  const push = usePush(Properties);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["property", params.propertyId],
    queryFn: async () => {
      const response = await Encore.Property.getProperty({
        propertyId: params.propertyId,
      });
      // Enhance the data with mock fields
      return {
        property: {
          ...response.property,
          apartments: response.property.apartments.map((apt) => ({
            ...apt,
            bedrooms: Math.floor(Math.random() * 3) + 1,
            bathrooms: Math.floor(Math.random() * 2) + 1,
            bookings: Array(Math.floor(Math.random() * 5))
              .fill(null)
              .map((_, i) => ({ id: `booking-${i}` })),
          })),
        },
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading property details...</h2>
        </div>
      </div>
    );
  }

  if (isError || !data?.property) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-destructive">
            {error instanceof Error ? error.message : "Property not found"}
          </p>
          <Button variant="outline" onClick={() => push({})}>
            Back to Properties
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { property } = data;
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
    <div className="animate-fade-in container mx-auto space-y-8 p-6">
      <div className="mb-6 flex items-center gap-4">
        <Properties.Link>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft size={16} />
          </Button>
        </Properties.Link>
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Building2 className="h-6 w-6" />
            {property.name}
          </h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-1" />
            <span>{property.address}</span>
          </div>
        </div>
      </div>

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
    </div>
  );
}
