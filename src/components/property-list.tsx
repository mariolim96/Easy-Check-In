"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Properties, CreateProperty } from "@/routes";
import { Encore } from "@/lib/utils";

interface PropertyListProps {
  searchTerm: string;
  filters: {
    hasSciaaLicense?: boolean;
    minGuests?: number;
    maxGuests?: number;
    sortBy: "name" | "address" | "guests";
    sortOrder: "asc" | "desc";
  };
  page: number;
}

export function PropertyList({ searchTerm, filters, page }: PropertyListProps) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["properties", { search: searchTerm, filters, page }],
    queryFn: () => Encore.Property.getProperties(),
  });

  if (isLoading) {
    return <div className="text-center">Loading properties...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to load properties"}
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.properties || data.properties.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4">No properties found</p>
        <CreateProperty.ParamsLink>
          <Button>Add Your First Property</Button>
        </CreateProperty.ParamsLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Address: {property.address}
              </p>
              <p className="text-sm text-muted-foreground">
                SCIA License: {property.has_sciaa_license ? "Yes" : "No"}
              </p>
              <p className="mt-4 text-sm font-medium">Apartments:</p>
              <ul className="list-inside list-disc">
                {property.apartments.map((apt) => (
                  <li key={apt.id} className="text-sm text-muted-foreground">
                    {apt.name} (Max Guests: {apt.maxGuests})
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
