import { z } from "zod";

export const Route = {
  name: "Properties",
  params: z.object({}),
  // Optional: Add search params if needed
  //   search: z.object({
  //     page: z.string().optional(),
  //     search: z.string().optional(),
  //     filter: z.string().optional(),
  //   }),
};
