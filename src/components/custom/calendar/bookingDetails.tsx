import type { Booking } from "./types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

interface BookingDetailsProps {
  selectedBooking: Booking | null;
  selectedDate: Date;
}

const BookingDetails = ({
  selectedBooking,
  selectedDate: _selectedDate,
}: BookingDetailsProps) => {
  if (!selectedBooking) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <CalendarIcon className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          Select a date with a booking to view details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Check-in</p>
          <p className="font-medium">
            {format(new Date(selectedBooking.checkIn), "MMM d, yyyy")}
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Check-out</p>
          <p className="font-medium">
            {format(new Date(selectedBooking.checkOut), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm text-muted-foreground">Guests</p>
        <div className="flex flex-wrap gap-2">
          {selectedBooking.guests.map((guest) => (
            <div
              key={guest.id}
              className="rounded-md bg-secondary px-2 py-1 text-sm"
            >
              {guest.firstName} {guest.lastName}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm text-muted-foreground">Platform</p>
        <div className="flex items-center">
          <div
            className={cn("rounded-md px-2 py-1 text-sm font-medium", {
              "bg-blue-100 text-blue-700":
                selectedBooking.platform === "booking",
              "bg-red-100 text-red-700": selectedBooking.platform === "airbnb",
              "bg-green-100 text-green-700":
                selectedBooking.platform === "direct",
              "bg-gray-100 text-gray-700": selectedBooking.platform === "other",
            })}
          >
            {selectedBooking.platform.charAt(0).toUpperCase() +
              selectedBooking.platform.slice(1)}
          </div>
          {selectedBooking.platformId && (
            <span className="ml-2 text-sm text-muted-foreground">
              ID: {selectedBooking.platformId}
            </span>
          )}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm text-muted-foreground">Status</p>
        <div
          className={cn(
            "inline-block rounded-md px-2 py-1 text-sm font-medium",
            {
              "bg-green-100 text-green-700":
                selectedBooking.status === "confirmed",
              "bg-yellow-100 text-yellow-700":
                selectedBooking.status === "cancelled",
              "bg-blue-100 text-blue-700":
                selectedBooking.status === "completed",
            },
          )}
        >
          {selectedBooking.status.charAt(0).toUpperCase() +
            selectedBooking.status.slice(1)}
        </div>
      </div>

      {selectedBooking.notes && (
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Notes</p>
          <p className="text-sm">{selectedBooking.notes}</p>
        </div>
      )}

      <Button variant="outline" className="mt-4 w-full">
        View Full Details
      </Button>
    </div>
  );
};

export default BookingDetails;
