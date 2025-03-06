"use client";

import { Properties, PropertyApi } from "@/routes";
import { useSearchParams } from "@/routes/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PropertyCard } from "@/components/property-card";

export default function PropertiesPage() {
  const searchParams = useSearchParams(Properties);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - replace with actual API call
  const properties = [
    { id: "1", name: "Luxury Apartment", type: "apartment", location: "Downtown" },
    { id: "2", name: "Family House", type: "house", location: "Suburbs" },
    { id: "3", name: "Studio Flat", type: "apartment", location: "City Center" },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Button variant="default">Add New Property</Button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex gap-4">
        <Input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">
          Filter
        </Button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle>{property.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Type: {property.type}</p>
              <p className="text-muted-foreground">Location: {property.location}</p>
              <div className="mt-4">
                <PropertyCard propertyId={property.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <Properties.Link
          search={{ page: "1" }}
          className="rounded-md px-4 py-2 hover:bg-accent"
        >
          1
        </Properties.Link>
        <Properties.Link
          search={{ page: "2" }}
          className="rounded-md px-4 py-2 hover:bg-accent"
        >
          2
        </Properties.Link>
        <Properties.Link
          search={{ page: "3" }}
          className="rounded-md px-4 py-2 hover:bg-accent"
        >
          3
        </Properties.Link>
      </div>
    </div>
  );
}
