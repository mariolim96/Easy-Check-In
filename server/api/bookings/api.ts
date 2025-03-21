import { api, APIError } from "encore.dev/api";
import { bookingQueries } from "./db";
import type {
  CreateBookingParams,
  UpdateBookingParams,
  ListBookingsParams,
  BookingResponse,
  ListBookingsResponse,
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
