"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Key,
  User,
  Bed,
  Bath,
  Plus,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProperty, PropertyDetail } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import { Encore } from "@/lib/utils";
import { usePush } from "@/routes/hooks";

// Mock data structure
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

function PropertyCard({ property }: { property: Property }) {
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

export default function PropertiesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await Encore.Property.getProperties();
      // Enhance the data with mock fields
      return {
        properties: response.properties.map((prop) => ({
          ...prop,
          apartments: prop.apartments.map((apt) => ({
            ...apt,
            bedrooms: Math.floor(Math.random() * 3) + 1,
            bathrooms: Math.floor(Math.random() * 2) + 1,
          })),
        })),
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-muted-foreground">
          Loading properties...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">
            Properties
          </h1>
          <p className="text-muted-foreground">
            Manage your properties and apartments
          </p>
        </div>

        <CreateProperty.Link>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </CreateProperty.Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="apartments">Apartments</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2">
            {data?.properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  hasSciaaLicense: property.has_sciaa_license,
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apartments">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.properties.flatMap((property) =>
              property.apartments.map((apartment) => (
                <Card
                  key={apartment.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative flex h-40 items-center justify-center bg-gradient-to-r from-accent/10 to-accent/20">
                    <Key className="h-20 w-20 text-accent-foreground/20" />
                  </div>

                  <CardContent className="p-6">
                    <h3 className="mb-1 text-lg font-semibold">
                      {apartment.name}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {property.name}
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

                    <PropertyDetail.Link propertyId={property.id}>
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </PropertyDetail.Link>
                  </CardContent>
                </Card>
              )),
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
