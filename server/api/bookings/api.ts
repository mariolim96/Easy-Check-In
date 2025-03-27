import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { bookingQueries } from "./db";
import type {
  CreateBookingParams,
  UpdateBookingParams,
  ListBookingsParams,
  BookingResponse,
  ListBookingsResponse,
  GetUserBookingsResponse,
  BookingWithDetails,
} from "./types";

export const createBooking = api(
  { method: "POST", path: "/bookings", expose: true },
  async (params: CreateBookingParams): Promise<BookingResponse> => {
    const booking = await bookingQueries.createBooking(params);
    return { booking };
  },
);

export const getBooking = api(
  { method: "GET", path: "/bookings/:bookingId", expose: true },
  async ({ bookingId }: { bookingId: string }): Promise<BookingResponse> => {
    const booking = await bookingQueries.getBooking(bookingId);
    if (!booking) {
      throw APIError.notFound("Booking not found");
    }
    return { booking };
  },
);

export const updateBookingStatus = api(
  { method: "PUT", path: "/bookings/:bookingId/status", expose: true },
  async (params: UpdateBookingParams): Promise<BookingResponse> => {
    const booking = await bookingQueries.updateBookingStatus(
      params.bookingId,
      params.status,
    );
    if (!booking) {
      throw APIError.notFound("Booking not found");
    }
    return { booking };
  },
);

export const listBookings = api(
  { method: "GET", path: "/bookings", expose: true },
  async (params: ListBookingsParams): Promise<ListBookingsResponse> => {
    const bookings = await bookingQueries.listBookings(params);
    return { bookings };
  },
);

export const getUserBookings = api(
  { method: "GET", path: "/bookings/user", expose: true, auth: true },
  async (): Promise<GetUserBookingsResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw APIError.unauthenticated("User not authenticated");
    }

    try {
      const bookings = await bookingQueries.getBookingsByUser(auth.userID);
      return { bookings };
    } catch (error) {
      throw APIError.internal("Failed to fetch user bookings", {
        cause: error,
        name: "DatabaseError",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);
