import { z } from "zod";

export const Route = {
  name: "CreateGuest",
  params: z.object({}),
  search: z.object({
    guestCount: z.number().optional(),
    bookingId: z.string().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
  }),
  description: "Create a new guest record",
};
