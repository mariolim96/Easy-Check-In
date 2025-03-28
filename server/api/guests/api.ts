import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { guestQueries } from "./db";
import type { CreateGuestParams, CreateGuestResponse } from "./types";

export const createGuest = api(
  { method: "POST", path: "/guests", expose: true, auth: true },
  async (params: CreateGuestParams): Promise<CreateGuestResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw APIError.unauthenticated("User not authenticated");
    }

    try {
      const guest = await guestQueries.createGuest(params);
      return { guest };
    } catch (error) {
      throw APIError.internal("Failed to create guest", {
        cause: error,
        name: "DatabaseError",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);