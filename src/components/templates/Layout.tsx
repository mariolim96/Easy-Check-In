"use client";
import { useState } from "react";
import Sidebar from "../section/Sidebar";
import Header from "../section/Header";
import MobileNav from "../section/MobileNav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
        <MobileNav setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
