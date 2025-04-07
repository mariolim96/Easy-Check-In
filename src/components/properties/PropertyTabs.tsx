"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyList } from "@/components/properties/PropertyList";
import { ApartmentList } from "@/components/properties/ApartmentList";
import { useQuery } from "@tanstack/react-query";
import { Encore } from "@/lib/utils";

export function PropertyTabs() {
  const { data } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await Encore.Property.getProperties();
      // Enhance the data with mock fields - using a deterministic approach
      return {
        properties: response.properties.map((prop, propIndex) => ({
          ...prop,
          apartments: prop.apartments.map((apt, aptIndex) => ({
            ...apt,
            bedrooms: ((propIndex + aptIndex) % 3) + 1, // 1, 2, or 3 bedrooms
            bathrooms: ((propIndex + aptIndex) % 2) + 1, // 1 or 2 bathrooms
          })),
        })),
      };
    },
  });

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Properties</TabsTrigger>
        <TabsTrigger value="apartments">Apartments</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <PropertyList properties={data?.properties ?? []} />
      </TabsContent>

      <TabsContent value="apartments">
        <ApartmentList properties={data?.properties ?? []} />
      </TabsContent>
    </Tabs>
  );
}
