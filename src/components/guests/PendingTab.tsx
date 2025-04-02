"use client";

import { useState } from "react";
import {
  Upload,
  ChevronDown,
  ChevronRight,
  Eye,
  FileEdit,
  Filter,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React from "react";

export interface Guest {
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
  documentScanUrl?: string;
  members?: Guest[];
}

export function PendingTab({
  guests,
  isLoading,
}: {
  guests: Guest[];
  isLoading: boolean;
}) {
  const [expandedGuests, setExpandedGuests] = useState<string[]>([]);

  const toggleExpand = (guestId: string) => {
    setExpandedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId],
    );
  };

  const hasMembers = (guest: Guest) =>
    guest.members && guest.members.length > 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Mobile view with cards */}
      <div className="space-y-4 lg:hidden">
        {guests.map((guest) => (
          <Card key={guest.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {guest.firstName} {guest.lastName}
                </CardTitle>
                {hasMembers(guest) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(guest.id)}
                  >
                    {expandedGuests.includes(guest.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {guest.guestType.replace("_", " ")}
                {hasMembers(guest) && ` (${guest.members?.length} members)`}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium">Document</div>
                  <div className="text-sm text-muted-foreground">
                    {guest.document.documentType} -{" "}
                    {guest.document.documentNumber}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Check-in</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(guest.checkIn).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Property</div>
                  <div className="text-sm text-muted-foreground">
                    {guest.property.name} - {guest.property.apartment.name}
                  </div>
                </div>
              </div>

              {/* Members section */}
              {expandedGuests.includes(guest.id) && guest.members && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div className="text-sm font-medium">Members</div>
                  {guest.members.map((member) => (
                    <div key={member.id} className="rounded-lg bg-muted/50 p-3">
                      <div className="font-medium">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.document.documentType} -{" "}
                        {member.document.documentNumber}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view with table */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Pending Submissions</CardTitle>
              {guests.length > 0 && (
                <Button onClick={handleSubmitAll}>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit All
                </Button>
              )}
            </div>
            <CardDescription>
              Guests that need to be submitted to Alloggiati Web
            </CardDescription>
          </CardHeader>
          <div className="mx-6 mb-6 rounded-lg border">
            <div className="overflow-hidden rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-secondary/50">
                    <TableHead className="h-12 w-[30px]"></TableHead>
                    <TableHead className="h-12">Guest</TableHead>
                    <TableHead className="h-12">Document</TableHead>
                    <TableHead className="h-12">Check-in Date</TableHead>
                    <TableHead className="h-12">Property</TableHead>
                    <TableHead className="h-12">Status</TableHead>
                    <TableHead className="h-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <React.Fragment key={guest.id}>
                      <TableRow className="border-b bg-card">
                        <TableCell>
                          {hasMembers(guest) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(guest.id)}
                            >
                              {expandedGuests.includes(guest.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {guest.firstName} {guest.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {guest.guestType.replace("_", " ")}
                            {hasMembers(guest) &&
                              ` (${guest.members?.length} members)`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{guest.document.documentType}</div>
                          <div className="text-sm text-muted-foreground">
                            {guest.document.documentNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(guest.checkIn).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>{guest.property.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {guest.property.apartment.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Pending
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedGuests.includes(guest.id) &&
                        guest.members?.map((member) => (
                          <TableRow
                            key={member.id}
                            className="border-b bg-muted/50"
                          >
                            <TableCell></TableCell>
                            <TableCell>
                              <div className="ml-4 font-medium">
                                {member.firstName} {member.lastName}
                              </div>
                              <div className="ml-4 text-sm text-muted-foreground">
                                {member.guestType.replace("_", " ")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{member.document.documentType}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.document.documentNumber}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(member.checkIn).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div>{member.property.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.property.apartment.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                Pending
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function handleSubmitAll() {
  // Implementation for submitting all pending guests
  console.log("Submitting all pending guests");
}

export const mockSubmittedGuests: Guest[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    guestType: "family_head",
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
    members: [
      {
        id: "1a",
        firstName: "Jane",
        lastName: "Doe",
        guestType: "family_member",
        checkIn: "2024-02-01",
        checkOut: "2024-02-05",
        bookingId: "booking1",
        document: {
          documentType: "passport",
          documentNumber: "AB123457",
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
      },
      {
        id: "1b",
        firstName: "Jimmy",
        lastName: "Doe",
        guestType: "family_member",
        checkIn: "2024-02-01",
        checkOut: "2024-02-05",
        bookingId: "booking1",
        document: {
          documentType: "passport",
          documentNumber: "AB123458",
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
      },
    ],
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Garcia",
    guestType: "group_leader",
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
    documentScanUrl: "https://example.com/scan2.pdf",
    members: [
      {
        id: "2a",
        firstName: "Carlos",
        lastName: "Garcia",
        guestType: "group_member",
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
        alloggiatiStatus: "submitted",
      },
      {
        id: "2b",
        firstName: "Ana",
        lastName: "Garcia",
        guestType: "group_member",
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
        alloggiatiStatus: "submitted",
      },
    ],
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Smith",
    guestType: "single_guest",
    checkIn: "2024-02-05",
    checkOut: "2024-02-08",
    bookingId: "booking3",
    document: {
      documentType: "passport",
      documentNumber: "UK456789",
      documentIssueCountry: "UK",
    },
    property: {
      id: "prop3",
      name: "Mountain View",
      apartment: {
        id: "apt3",
        name: "Room 303",
      },
    },
    alloggiatiStatus: "submitted",
    documentScanUrl: "https://example.com/scan3.pdf",
    members: [],
  },
];
