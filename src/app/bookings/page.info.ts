import { z } from "zod";

export const Route = {
  name: "Bookings",
  params: z.object({
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    bookingId: z.string().optional(),
    guestCount: z.number().optional(),
  }),
};
