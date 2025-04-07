"use client";

import { Building2, Calendar, Users, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Encore } from "@/lib/utils";

export function DashboardSummary() {
  const { data } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      // Static mock data to ensure consistency between server and client
      return {
        propertyCount: 12,
        bookingCount: 48,
        guestCount: 124,
        revenue: 24680,
      };
    },
  });

  const summaryItems = [
    {
      title: "Properties",
      value: data?.propertyCount || 0,
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Bookings",
      value: data?.bookingCount || 0,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Guests",
      value: data?.guestCount || 0,
      icon: Users,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
    {
      title: "Revenue",
      value: data?.revenue ? `$${data.revenue.toLocaleString()}` : "$0",
      icon: CreditCard,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`rounded-full p-2 ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
