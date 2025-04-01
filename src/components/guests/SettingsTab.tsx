"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for properties
const mockProperties = [
  {
    id: "prop1",
    name: "Villa Serena",
    structureId: "VS456",
    username: "NA018476",
    status: "connected",
  },
  {
    id: "prop2",
    name: "Casa Bella",
    structureId: "CB123",
    username: "casabella",
    status: "connected",
  },
];

export function SettingsTab() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Alloggiati Web Accounts</CardTitle>
        <CardDescription>
          Manage your property connections to Alloggiati Web
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockProperties.map((property) => (
            <div key={property.id} className="rounded-lg border p-4">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="mb-1 font-medium">{property.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Structure ID: {property.structureId}
                  </p>
                </div>
                <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  Connected
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-muted-foreground">
                    Username
                  </label>
                  <Input
                    value={property.username}
                    disabled
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-muted-foreground">
                    Password
                  </label>
                  <Input
                    value="********"
                    type="password"
                    disabled
                    className="bg-secondary/50"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" variant="outline">
                  Edit Account
                </Button>
              </div>
            </div>
          ))}

          <Button className="w-full">Add New Alloggiati Web Account</Button>
        </div>
      </CardContent>
    </Card>
  );
}
