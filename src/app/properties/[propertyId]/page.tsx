"use client";

import { PropertyDetail } from "@/routes";
import { useParams } from "@/routes/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Properties } from "@/routes";

export default function PropertyDetailPage() {
  const { propertyId } = useParams(PropertyDetail);

  // Mock data - replace with actual API call
  const property = {
    id: propertyId,
    name: "Luxury Apartment",
    type: "apartment",
    location: "Downtown",
    description: "A beautiful luxury apartment in the heart of downtown",
    amenities: ["Pool", "Gym", "Parking", "Security"],
    price: "$2,500/month",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    yearBuilt: 2020,
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <Properties.Link>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
        </Properties.Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Property Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-3xl">{property.name}</CardTitle>
            <p className="text-muted-foreground">{property.location}</p>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>{property.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Details</h3>
                  <ul className="mt-2 space-y-2">
                    <li>Type: {property.type}</li>
                    <li>Bedrooms: {property.bedrooms}</li>
                    <li>Bathrooms: {property.bathrooms}</li>
                    <li>Square Feet: {property.squareFeet}</li>
                    <li>Year Built: {property.yearBuilt}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Amenities</h3>
                  <ul className="mt-2 space-y-2">
                    {property.amenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Information */}
        <Card>
          <CardHeader>
            <CardTitle>Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{property.price}</p>
            <div className="mt-6 space-y-4">
              <Button className="w-full">Schedule Viewing</Button>
              <Button variant="outline" className="w-full">
                Contact Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sections */}
      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add a map component here */}
            <div className="flex h-[300px] items-center justify-center bg-muted">
              Map placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
