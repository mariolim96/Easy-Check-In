"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingTab } from "@/components/guests/PendingTab";
import { Encore } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmittedTab } from "@/components/guests/SubmittedTab";
import { SettingsTab } from "@/components/guests/SettingsTab";
import { ReceiptsTab } from "@/components/guests/ReceiptsTab";

// Types based on your API
interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: string;
  checkIn: string;
  checkOut: string;
  bookingId: string;
  document: {
    documentType: string;
    documentNumber: string;
    documentIssueCountry: string;
  };
  property: {
    id: string;
    name: string;
    apartment: {
      id: string;
      name: string;
    };
  };
  alloggiatiStatus: "pending" | "submitted";
  members?: Guest[];
  alloggiatiWebReceiptUrl?: string;
  submittedAt?: string;
}

// Mock data for initial development
const mockGuests: Guest[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    guestType: "single_guest",
    checkIn: "2024-02-01",
    checkOut: "2024-02-05",
    bookingId: "booking1",
    document: {
      documentType: "passport",
      documentNumber: "AB123456",
      documentIssueCountry: "USA",
    },
    property: {
      id: "prop1",
      name: "Villa Serena",
      apartment: {
        id: "apt1",
        name: "Suite 101",
      },
    },
    alloggiatiStatus: "submitted",
    documentScanUrl: "https://example.com/scan1.pdf",
    members: [],
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Garcia",
    guestType: "family_head",
    checkIn: "2024-02-03",
    checkOut: "2024-02-10",
    bookingId: "booking2",
    document: {
      documentType: "national_id",
      documentNumber: "XY789012",
      documentIssueCountry: "Spain",
    },
    property: {
      id: "prop2",
      name: "Casa Bella",
      apartment: {
        id: "apt2",
        name: "Room 202",
      },
    },
    alloggiatiStatus: "submitted",
    members: [
      {
        id: "2a",
        firstName: "Lucas",
        lastName: "Garcia",
        guestType: "family_member",
        checkIn: "2024-02-03",
        checkOut: "2024-02-10",
        bookingId: "booking2",
        document: {
          documentType: "national_id",
          documentNumber: "XY789013",
          documentIssueCountry: "Spain",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt2",
            name: "Room 202",
          },
        },
        alloggiatiStatus: "pending",
      },
      {
        id: "2b",
        firstName: "Isabella",
        lastName: "Garcia",
        guestType: "family_member",
        checkIn: "2024-02-03",
        checkOut: "2024-02-10",
        bookingId: "booking2",
        document: {
          documentType: "national_id",
          documentNumber: "XY789014",
          documentIssueCountry: "Spain",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt2",
            name: "Room 202",
          },
        },
        alloggiatiStatus: "pending",
      },
    ],
  },
  {
    id: "3",
    firstName: "Hans",
    lastName: "Schmidt",
    guestType: "single_guest",
    checkIn: "2024-02-05",
    checkOut: "2024-02-07",
    bookingId: "booking3",
    document: {
      documentType: "passport",
      documentNumber: "DE567890",
      documentIssueCountry: "Germany",
    },
    property: {
      id: "prop1",
      name: "Villa Serena",
      apartment: {
        id: "apt3",
        name: "Suite 103",
      },
    },
    alloggiatiStatus: "pending",
    submittedAt: undefined,
  },
  {
    id: "4",
    firstName: "Sophie",
    lastName: "Martin",
    guestType: "group_leader",
    checkIn: "2024-02-10",
    checkOut: "2024-02-15",
    bookingId: "booking4",
    document: {
      documentType: "passport",
      documentNumber: "FR123789",
      documentIssueCountry: "France",
    },
    property: {
      id: "prop2",
      name: "Casa Bella",
      apartment: {
        id: "apt4",
        name: "Room 204",
      },
    },
    alloggiatiStatus: "pending",
    members: [
      {
        id: "4a",
        firstName: "Pierre",
        lastName: "Dubois",
        guestType: "group_member",
        checkIn: "2024-02-10",
        checkOut: "2024-02-15",
        bookingId: "booking4",
        document: {
          documentType: "passport",
          documentNumber: "FR123790",
          documentIssueCountry: "France",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt4",
            name: "Room 204",
          },
        },
        alloggiatiStatus: "pending",
      },
      {
        id: "4b",
        firstName: "Marie",
        lastName: "Laurent",
        guestType: "group_member",
        checkIn: "2024-02-10",
        checkOut: "2024-02-15",
        bookingId: "booking4",
        document: {
          documentType: "passport",
          documentNumber: "FR123791",
          documentIssueCountry: "France",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt4",
            name: "Room 204",
          },
        },
        alloggiatiStatus: "pending",
      },
      {
        id: "4c",
        firstName: "Claude",
        lastName: "Moreau",
        guestType: "group_member",
        checkIn: "2024-02-10",
        checkOut: "2024-02-15",
        bookingId: "booking4",
        document: {
          documentType: "passport",
          documentNumber: "FR123792",
          documentIssueCountry: "France",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt4",
            name: "Room 204",
          },
        },
        alloggiatiStatus: "pending",
      },
    ],
  },
  {
    id: "5",
    firstName: "Alessandro",
    lastName: "Rossi",
    guestType: "single_guest",
    checkIn: "2024-02-12",
    checkOut: "2024-02-14",
    bookingId: "booking5",
    document: {
      documentType: "national_id",
      documentNumber: "IT456123",
      documentIssueCountry: "Italy",
    },
    property: {
      id: "prop1",
      name: "Villa Serena",
      apartment: {
        id: "apt5",
        name: "Suite 105",
      },
    },
    alloggiatiStatus: "pending",
    submittedAt: undefined,
  },
  {
    id: "6",
    firstName: "Emma",
    lastName: "Wilson",
    guestType: "family_head",
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
    bookingId: "booking6",
    document: {
      documentType: "passport",
      documentNumber: "UK789456",
      documentIssueCountry: "United Kingdom",
    },
    property: {
      id: "prop2",
      name: "Casa Bella",
      apartment: {
        id: "apt6",
        name: "Room 206",
      },
    },
    alloggiatiStatus: "pending",
    members: [
      {
        id: "6a",
        firstName: "Oliver",
        lastName: "Wilson",
        guestType: "family_member",
        checkIn: "2024-02-15",
        checkOut: "2024-02-20",
        bookingId: "booking6",
        document: {
          documentType: "passport",
          documentNumber: "UK789457",
          documentIssueCountry: "United Kingdom",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt6",
            name: "Room 206",
          },
        },
        alloggiatiStatus: "pending",
      },
    ],
  },
  {
    id: "7",
    firstName: "Yuki",
    lastName: "Tanaka",
    guestType: "single_guest",
    checkIn: "2024-02-18",
    checkOut: "2024-02-25",
    bookingId: "booking7",
    document: {
      documentType: "passport",
      documentNumber: "JP234567",
      documentIssueCountry: "Japan",
    },
    property: {
      id: "prop1",
      name: "Villa Serena",
      apartment: {
        id: "apt7",
        name: "Suite 107",
      },
    },
    alloggiatiStatus: "submitted",
    alloggiatiWebReceiptUrl: "https://example.com/receipt7.pdf",
    submittedAt: "2024-02-18T11:20:00Z",
  },
  {
    id: "8",
    firstName: "Carlos",
    lastName: "Silva",
    guestType: "group_leader",
    checkIn: "2024-02-20",
    checkOut: "2024-02-23",
    bookingId: "booking8",
    document: {
      documentType: "national_id",
      documentNumber: "BR891234",
      documentIssueCountry: "Brazil",
    },
    property: {
      id: "prop2",
      name: "Casa Bella",
      apartment: {
        id: "apt8",
        name: "Room 208",
      },
    },
    alloggiatiStatus: "pending",
    members: [
      {
        id: "8a",
        firstName: "Paulo",
        lastName: "Santos",
        guestType: "group_member",
        checkIn: "2024-02-20",
        checkOut: "2024-02-23",
        bookingId: "booking8",
        document: {
          documentType: "national_id",
          documentNumber: "BR891235",
          documentIssueCountry: "Brazil",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt8",
            name: "Room 208",
          },
        },
        alloggiatiStatus: "pending",
      },
      {
        id: "8b",
        firstName: "Ana",
        lastName: "Oliveira",
        guestType: "group_member",
        checkIn: "2024-02-20",
        checkOut: "2024-02-23",
        bookingId: "booking8",
        document: {
          documentType: "national_id",
          documentNumber: "BR891236",
          documentIssueCountry: "Brazil",
        },
        property: {
          id: "prop2",
          name: "Casa Bella",
          apartment: {
            id: "apt8",
            name: "Room 208",
          },
        },
        alloggiatiStatus: "pending",
      },
    ],
  },
];

const GuestsPage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  //   const isMobile = useIsMobile();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        // For development, use mock data
        // In production, uncomment the API call
        // const response = await Encore.guests.listGuests();
        // setGuests(response);
        setGuests(mockGuests);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch guests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuests();
  }, [toast]);

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
