import { db } from "../../db/db";
import type {
  Booking,
  BookingWithDetails,
  CreateBookingParams,
  ListBookingsParams,
} from "./types";

export const bookingQueries = {
  async createBooking(params: CreateBookingParams): Promise<Booking> {
    const result = db.query<Booking>`
      INSERT INTO bookings (
        apartment_id, check_in, check_out, guest_count,
        "source", external_id, status, notes, amount
      ) VALUES (
        ${params.apartmentId}::uuid,
        ${params.checkIn},
        ${params.checkOut},
        ${params.guestCount},
        ${params.source}::text,
        ${params.externalId ?? null},
        ${params.status},
        ${params.notes ?? null},
        ${params.amount}
      )
      RETURNING *
    `;

    for await (const booking of result) {
      return booking;
    }
    throw new Error("Failed to create booking" + JSON.stringify(params));
  },

  async getBooking(bookingId: string): Promise<Booking | null> {
    const result = db.query<Booking>`
      SELECT * FROM bookings WHERE id = ${bookingId}
    `;

    for await (const booking of result) {
      return booking;
    }
    return null;
  },

  async updateBookingStatus(
    bookingId: string,
    status: string,
  ): Promise<Booking | null> {
    const result = db.query<Booking>`
      UPDATE bookings
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${bookingId}
      RETURNING *
    `;

    for await (const booking of result) {
      return booking;
    }
    return null;
  },

  async listBookings(params: ListBookingsParams): Promise<Booking[]> {
    const conditions = ["1=1"];
    if (params.apartmentId)
      conditions.push(`apartment_id = ${params.apartmentId}`);
    if (params.status) conditions.push(`status = ${params.status}`);
    if (params.fromDate) conditions.push(`check_in >= ${params.fromDate}`);
    if (params.toDate) conditions.push(`check_out <= ${params.toDate}`);

    const whereClause = conditions.join(" AND ");

    const result = db.query<Booking>`
      SELECT * FROM bookings
      WHERE ${whereClause}
      ORDER BY check_in ASC
    `;

    const bookings: Booking[] = [];
    for await (const booking of result) {
      bookings.push(booking);
    }
    return bookings;
  },

  async getBookingsByUser(userId: string): Promise<BookingWithDetails[]> {
    const result = db.query<BookingWithDetails>`
      SELECT 
        b.*,
        a.name as apartment_name,
        p.name as property_name
      FROM bookings b
      JOIN apartments a ON b.apartment_id = a.id
      JOIN properties p ON a.property_id = p.id
      WHERE p.user_id = ${userId}
      ORDER BY b.check_in DESC
    `;

    const bookings: BookingWithDetails[] = [];
    for await (const booking of result) {
      bookings.push(booking);
    }
    return bookings;
  },
};
