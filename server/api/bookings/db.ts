import { db } from "../../db/db";
import type { Booking, CreateBookingParams, ListBookingsParams } from "./types";

export const bookingQueries = {
  async createBooking(params: CreateBookingParams): Promise<Booking> {
    const result = db.query<Booking>`
      INSERT INTO bookings (
        apartment_id, check_in, check_out, guest_count,
        source, external_id, status
      ) VALUES (
        ${params.apartmentId}, ${params.checkIn}, ${params.checkOut},
        ${params.guestCount}, ${params.source}, ${params.externalId ?? null},
        ${params.status}
      )
      RETURNING *
    `;

    for await (const booking of result) {
      return booking;
    }
    throw new Error("Failed to create booking");
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
};
