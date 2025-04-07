import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your properties, bookings, and guests",
};

export default function Home() {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4">
        <Suspense fallback={<DashboardSummarySkeleton />}>
          <DashboardSummary />
        </Suspense>

        <Suspense fallback={<DashboardChartsSkeleton />}>
          <DashboardCharts />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardSummarySkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-24 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
        ></div>
      ))}
    </div>
  );
}

function DashboardChartsSkeleton() {
  return (
    <div className="flex flex-1 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
        ></div>
      ))}
    </div>
  );
}
