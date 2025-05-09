"use client";

import { Home, Building2, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Home as HomeRoute, Properties } from "@/routes";

interface MobileNavProps {
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ setActiveTab }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t bg-background md:hidden">
      <HomeRoute.Link className="flex-1">
        <Button
          variant="ghost"
          className="flex w-full flex-col items-center py-2"
          onClick={() => setActiveTab("overview")}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-xs">Overview</span>
        </Button>
      </HomeRoute.Link>

      <Properties.Link className="flex-1">
        <Button
          variant="ghost"
          className="flex w-full flex-col items-center py-2"
          onClick={() => setActiveTab("properties")}
        >
          <Building2 className="h-5 w-5" />
          <span className="mt-1 text-xs">Properties</span>
        </Button>
      </Properties.Link>

      {/* Keep these as is for now since we haven't created their routes yet */}
      <Button
        variant="ghost"
        className="flex flex-1 flex-col items-center py-2"
        onClick={() => setActiveTab("tenants")}
      >
        <Users className="h-5 w-5" />
        <span className="mt-1 text-xs">Tenants</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-1 flex-col items-center py-2"
        onClick={() => setActiveTab("maintenance")}
      >
        <Wrench className="h-5 w-5" />
        <span className="mt-1 text-xs">Maintenance</span>
      </Button>
    </nav>
  );
}
