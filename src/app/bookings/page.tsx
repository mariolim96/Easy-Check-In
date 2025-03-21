"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Filter,
  ChevronDown,
  CalendarDays,
  Building2,
  ArrowUpDown,
  Eye,
  FileEdit,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Encore } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { usePush } from "@/routes/hooks";
import { Bookings, CreateBooking } from "@/routes";
import { string } from "zod";
import {
  Booking,
  ListBookingsParams,
} from "../../../server/api/bookings/types";

const BOOKING_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

const BOOKING_SOURCES = {
  DIRECT: "direct",
  AIRBNB: "airbnb",
  BOOKING: "booking",
  OTHER: "other",
};

export default function BookingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterApartment, setFilterApartment] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch bookings
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["bookings", filterStatus, filterApartment],
    queryFn: async () => {
      const params: ListBookingsParams = {};
      if (filterStatus !== "all") params.status = filterStatus;
      if (filterApartment !== "all") params.apartmentId = filterApartment;
      // const res = await Encore.Booking.listBookings(params);
      // const response = await Encore.Booking.listBookings({
      //   apartmentId: filterApartment !== "all" ? filterApartment : undefined,
      //   status: filterStatus !== "all" ? filterStatus : undefined,
      //   fromDate: undefined,
      //   toDate: undefined,
      // });
      const response = {
        bookings: [
          {
            id: "mock-1",
            apartmentId: "Apartment 101",
            checkIn: new Date().toISOString(),
            checkOut: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            guestCount: 2,
            source: "airbnb",
            status: "confirmed",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-2",
            apartmentId: "Apartment 102",
            checkIn: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            checkOut: new Date(
              Date.now() + 21 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            guestCount: 3,
            source: "booking",
            externalId: "BOK123",
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-3",
            apartmentId: "Apartment 103",
            checkIn: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            checkOut: new Date().toISOString(),
            guestCount: 1,
            source: "direct",
            status: "completed",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      return response;
    },
  });

  // Fetch apartments for filter
  const { data: propertiesData } = useQuery({
    queryKey: ["properties"],
    queryFn: () => Encore.Property.getProperties(),
  });

  const filteredBookings =
    bookingsData?.bookings
      .filter((booking) => {
        // if (searchQuery) {
        //   const query = searchQuery.toLowerCase();
        //   return (
        //     booking.apartmentId.toLowerCase().includes(query) ||
        //     booking.source.toLowerCase().includes(query) ||
        //     (booking.externalId &&
        //       booking.externalId.toLowerCase().includes(query))
        //   );
        // }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.checkIn).getTime();
        const dateB = new Date(b.checkIn).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }) ?? [];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleAddBooking = () => {
    router.push(CreateBooking());
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      [BOOKING_STATUSES.CONFIRMED]: "bg-green-100 text-green-700",
      [BOOKING_STATUSES.CANCELLED]: "bg-red-100 text-red-700",
      [BOOKING_STATUSES.COMPLETED]: "bg-blue-100 text-blue-700",
      [BOOKING_STATUSES.PENDING]: "bg-yellow-100 text-yellow-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getSourceStyle = (source: string) => {
    const styles = {
      [BOOKING_SOURCES.DIRECT]: "bg-green-100 text-green-700",
      [BOOKING_SOURCES.AIRBNB]: "bg-red-100 text-red-700",
      [BOOKING_SOURCES.BOOKING]: "bg-blue-100 text-blue-700",
      [BOOKING_SOURCES.OTHER]: "bg-gray-100 text-gray-700",
    };
    return styles[source] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">
            Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage all your property bookings in one place
          </p>
        </div>

        <Button onClick={handleAddBooking}>
          <Plus className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative">
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 md:w-80"
          />
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={filterApartment} onValueChange={setFilterApartment}>
            <SelectTrigger className="w-40">
              <Building2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Apartments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apartments</SelectItem>
              {propertiesData?.properties.map((property) =>
                property.apartments.map((apartment) => (
                  <SelectItem key={apartment.id} value={apartment.id}>
                    {`${property.name} - ${apartment.name}`}
                  </SelectItem>
                )),
              )}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(BOOKING_STATUSES).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={toggleSortOrder}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Sort by Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-xl border">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Apartment</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="text-muted-foreground">
                    Loading bookings...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No bookings found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking, id) => (
                <TableRow
                  key={booking.id}
                  className={` ${id % 2 !== 0 ? "bg-primary-foreground/70" : "bg-primary-foreground"}`}
                >
                  <TableCell>{booking.apartmentId}</TableCell>
                  <TableCell>
                    {format(new Date(booking.checkIn), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.checkOut), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{booking.guestCount} guests</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-block rounded-md px-2 py-1 text-xs font-medium",
                        getSourceStyle(booking.source),
                      )}
                    >
                      {booking.source}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-block rounded-md px-2 py-1 text-xs font-medium",
                        getStatusStyle(booking.status),
                      )}
                    >
                      {booking.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                        // onClick={() => router.push(`/bookings/${booking.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        // onClick={() =>
                        //   router.push(`/bookings/${booking.id}/edit`)
                        // }
                        >
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit booking
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            // Handle cancellation
                            // Encore.Booking.updateBookingStatus({
                            //   bookingId: booking.id,
                            //   status: BOOKING_STATUSES.CANCELLED,
                            // });
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
