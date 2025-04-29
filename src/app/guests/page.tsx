"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingTab } from "@/components/guests/PendingTab";
import { useToast } from "@/hooks/use-toast";
import { SubmittedTab } from "@/components/guests/SubmittedTab";
import { SettingsTab } from "@/components/guests/SettingsTab";
import { ReceiptsTab } from "@/components/guests/ReceiptsTab";
import { useQuery } from "@tanstack/react-query";
import { Encore } from "@/lib/utils";

const GuestsPage = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const { toast } = useToast();
  const sendAlloggiati = Encore.Alloggiati.sendFileUnico;

  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      try {
        // For development, use mock data
        // In production, uncomment the API call
        const response = await Encore.guests.listGuests();
        // console.log(" var:", vars);
        return response.guests;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch guests",
          variant: "destructive",
        });
        throw error;
      }
    },
  });

  const pendingGuests = guests.filter((g) => g.alloggiatiStatus === "pending");
  const submittedGuests = guests.filter(
    (g) => g.alloggiatiStatus === "submitted",
  );

  return (
    <div className="container mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guests</h1>
        <p className="text-muted-foreground">
          Manage your property guests and submissions
        </p>
      </div>

      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Reminder</AlertTitle>
        <AlertDescription>
          According to Italian regulations, all guest data must be submitted to
          Alloggiati Web within 24 hours of check-in.
        </AlertDescription>
      </Alert>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingGuests.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({submittedGuests.length})
          </TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingTab guests={pendingGuests} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="submitted">
          <SubmittedTab guests={submittedGuests} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="receipts">
          <ReceiptsTab
            submittedGuests={submittedGuests}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuestsPage;
