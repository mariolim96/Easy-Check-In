"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export function DashboardCharts() {
  const { data: bookingData } = useQuery({
    queryKey: ["dashboard-bookings"],
    queryFn: async () => {
      // Static mock data to ensure consistency between server and client
      return {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        bookings: [12, 18, 15, 22, 30, 28],
      };
    },
  });

  const { data: revenueData } = useQuery({
    queryKey: ["dashboard-revenue"],
    queryFn: async () => {
      // Static mock data to ensure consistency between server and client
      return {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        revenue: [3200, 4800, 3900, 5600, 7800, 7200],
      };
    },
  });

  return (
    <div className="grid flex-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {bookingData ? (
              <div className="flex h-full flex-col justify-end">
                <div className="flex h-[240px] items-end gap-2">
                  {bookingData.bookings.map((value, i) => (
                    <div
                      key={i}
                      className="relative flex w-full flex-col items-center"
                    >
                      <div
                        className="w-full rounded-t bg-primary"
                        style={{
                          height: `${(value / Math.max(...bookingData.bookings)) * 100}%`,
                        }}
                      ></div>
                      <span className="mt-2 text-xs">
                        {bookingData.months[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {revenueData ? (
              <div className="flex h-full flex-col justify-end">
                <div className="flex h-[240px] items-end gap-2">
                  {revenueData.revenue.map((value, i) => (
                    <div
                      key={i}
                      className="relative flex w-full flex-col items-center"
                    >
                      <div
                        className="w-full rounded-t bg-green-500"
                        style={{
                          height: `${(value / Math.max(...revenueData.revenue)) * 100}%`,
                        }}
                      ></div>
                      <span className="mt-2 text-xs">
                        {revenueData.months[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
