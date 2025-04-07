"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProperty } from "@/routes";

export function PropertiesHeader() {
  return (
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
  );
}
