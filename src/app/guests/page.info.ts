import { z } from "zod";

export const Route = {
  name: "Guests",
  params: z.object({}),
  search: z.object({
    status: z.enum(["pending", "submitted"]).optional(),
    search: z.string().optional(),
  }),
  description: "Manage guest records and submissions",
};
