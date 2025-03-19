"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProperty } from "@/routes";
import { Encore } from "@/lib/utils";

export default function PropertiesPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["properties"],
    queryFn: () => Encore.Property.getProperties(),
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Properties</h1>
        <CreateProperty.Link>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Property
          </Button>
        </CreateProperty.Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-lg text-muted-foreground">
            Loading properties...
          </div>
        </div>
      )}

      {isError && (
        <Card className="bg-destructive/10">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load properties"}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading &&
        !isError &&
        (!data?.properties || data.properties.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="mb-4 text-muted-foreground">No properties found</p>
              <CreateProperty.Link>
                <Button>Create Your First Property</Button>
              </CreateProperty.Link>
            </CardContent>
          </Card>
        )}

      {data?.properties && data.properties.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                ...property,
                hasSciaaLicense: property.has_sciaa_license,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface Property {
  id: string;
  name: string;
  address: string;
  hasSciaaLicense: boolean;
  apartments: {
    id: string;
    name: string;
    maxGuests: number;
  }[];
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{property.name}</span>
          {property.hasSciaaLicense && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
              SCIA License
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="text-sm">{property.address}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Apartments ({property.apartments.length})
            </p>
            <ul className="mt-2 space-y-1">
              {property.apartments.map((apartment) => (
                <li
                  key={apartment.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{apartment.name}</span>
                  <span className="text-muted-foreground">
                    Max Guests: {apartment.maxGuests}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
            <Button variant="outline" className="w-full">
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
