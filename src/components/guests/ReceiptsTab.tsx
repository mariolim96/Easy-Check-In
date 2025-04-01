"use client";

import { format } from "date-fns";
import { FileCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  alloggiatiWebReceiptUrl?: string;
  submittedAt?: string;
}

interface ReceiptsTabProps {
  submittedGuests: Guest[];
  isLoading?: boolean;
}

export function ReceiptsTab({ submittedGuests, isLoading }: ReceiptsTabProps) {
  const guestsWithReceipts = submittedGuests.filter(
    (guest) => guest.alloggiatiWebReceiptUrl,
  );

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Receipts Archive</CardTitle>
        <CardDescription>
          Archive of all submission receipts (stored for 5 years)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {guestsWithReceipts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guestsWithReceipts.map((guest) => (
              <Card
                key={guest.id}
                className="border transition-all hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="mb-1 font-medium">
                        Receipt #{guest.id.substring(0, 6)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {guest.firstName} {guest.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submitted on{" "}
                        {format(
                          new Date(guest.submittedAt || new Date()),
                          "MMM d, yyyy",
                        )}
                      </p>
                    </div>
                    <FileCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileCheck className="mb-4 h-12 w-12 text-primary/40" />
            <h3 className="mb-2 text-lg font-medium">No Receipts Found</h3>
            <p className="max-w-md text-center text-muted-foreground">
              There are no submission receipts available at the moment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
