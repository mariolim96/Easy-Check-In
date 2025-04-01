"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ClipboardList,
  Download,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Guest } from "./PendingTab";

interface SubmittedTabProps {
  guests: Guest[];
  isLoading: boolean;
}

export function SubmittedTab({ guests, isLoading }: SubmittedTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGuests, setExpandedGuests] = useState<string[]>([]);
  const isMobile = useIsMobile();

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
        <CardTitle>Submission History</CardTitle>
        <CardDescription>
          Records of all submitted guest information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search submissions..."
              className="max-w-xs pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ClipboardList className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {isMobile ? (
          <div className="space-y-4">
            {guests.map((guest) => (
              <Card key={guest.id} className="overflow-hidden border">
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">
                        {guest.firstName} {guest.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {guest.guestType}
                        {hasMembers(guest) &&
                          ` (${guest.members?.length} members)`}
                      </p>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Submitted
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Document</p>
                      <p>
                        {guest.document.documentType} (
                        {guest.document.documentNumber})
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Check-in</p>
                      <p>{format(new Date(guest.checkIn), "MMM d, yyyy")}</p>
                    </div>
                  </div>

                  {hasMembers(guest) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(guest.id)}
                      className="mb-3"
                    >
                      {expandedGuests.includes(guest.id) ? (
                        <ChevronDown className="mr-2 h-4 w-4" />
                      ) : (
                        <ChevronRight className="mr-2 h-4 w-4" />
                      )}
                      View Members
                    </Button>
                  )}

                  {expandedGuests.includes(guest.id) && guest.members && (
                    <div className="mb-3 space-y-2">
                      {guest.members.map((member) => (
                        <div
                          key={member.id}
                          className="rounded-lg bg-muted/50 p-3"
                        >
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

                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
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
                    <TableHead className="h-12 text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <>
                      <TableRow key={guest.id} className="border-b bg-card">
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
                            {guest.guestType}
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
                          {format(new Date(guest.checkIn), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div>{guest.property.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {guest.property.apartment.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Submitted
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
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
                                {member.guestType}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{member.document.documentType}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.document.documentNumber}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(member.checkIn), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <div>{member.property.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.property.apartment.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                Submitted
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
