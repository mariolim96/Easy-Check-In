"use client";

import { Button } from "@/components/ui/button";
import { Home, Building2, FileText, Send } from "lucide-react";

type MobileNavProps = {
  setActiveTab: (tab: string) => void;
};

export default function MobileNav({ setActiveTab }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t bg-background md:hidden">
      <Button
        variant="ghost"
        className="flex flex-1 flex-col items-center py-2 pt-10"
        onClick={() => setActiveTab("overview")}
      >
        <Home className="h-5 w-5" />
        <span className="mt-1 text-xs">Overview</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-1 flex-col items-center py-2 pt-10"
        onClick={() => setActiveTab("guests")}
      >
        <Building2 className="h-5 w-5" />
        <span className="mt-1 text-xs">Guests</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-1 flex-col items-center py-2 pt-10"
        onClick={() => setActiveTab("documents")}
      >
        <FileText className="h-5 w-5" />
        <span className="mt-1 text-xs">Documents</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-1 flex-col items-center py-2 pt-10"
        onClick={() => setActiveTab("alloggiatiweb")}
      >
        <Send className="h-5 w-5" />
        <span className="mt-1 text-xs">AlloggiatiWeb</span>
      </Button>
    </nav>
  );
}
