"use client";

import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Properties } from "@/routes";

interface Property {
  id: string;
  name: string;
  address: string;
}

interface PropertyHeaderProps {
  property: Property;
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
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
  );
}
