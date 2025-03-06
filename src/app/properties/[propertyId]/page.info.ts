import { z } from "zod";

export const Route = {
  name: "PropertyDetail",
  params: z.object({
    propertyId: z.string(),
  }),
};
