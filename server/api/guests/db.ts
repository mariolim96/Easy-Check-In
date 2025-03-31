import { db } from "../../db/db";
import type {
  CreateGuestParams,
  Guest,
  GuestDocument,
  CreateBookingGuestParams,
} from "./types";

export const guestQueries = {
  async createGuest(params: CreateGuestParams): Promise<Guest> {
    const result = db.query<Guest>`
      INSERT INTO guests (
        first_name, last_name, gender, date_of_birth,
        place_of_birth, nationality
      ) VALUES (
        ${params.firstName},
        ${params.lastName},
        ${params.gender},
        ${params.dateOfBirth}::date,
        ${params.placeOfBirth},
        ${params.nationality}
      )
      RETURNING *
    `;

    for await (const guest of result) {
      return guest;
    }
    throw new Error("Failed to create guest");
  },

  async createGuestDocument(guestId: string, document: GuestDocument) {
    const result = db.query`
      INSERT INTO guest_documents (
        guest_id,
        document_issue_date,
        document_expiry_date,
        document_issue_place,
        document_type,
        document_number,
        document_scan,
        document_issue_country
      ) VALUES (
        ${guestId}::uuid,
        ${document.documentIssueDate}::date,
        ${document.documentExpiryDate}::date,
        ${document.documentIssuePlace},
        ${document.documentType},
        ${document.documentNumber},
        ${document.documentScan ?? null},
        ${document.documentIssueCountry}
      )
      RETURNING *
    `;

    for await (const doc of result) {
      return doc;
    }
    throw new Error("Failed to create guest document");
  },

  async linkGuestToBooking(params: CreateBookingGuestParams) {
    const result = db.query`
      INSERT INTO booking_guests (
        booking_id,
        guest_id,
        guest_type,
        check_in,
        check_out
      ) VALUES (
        ${params.bookingId}::uuid,
        ${params.guestId}::uuid,
        ${params.guestType},
        ${params.checkIn}::date,
        ${params.checkOut}::date
      )
      RETURNING *
    `;

    for await (const bookingGuest of result) {
      return bookingGuest;
    }
    throw new Error("Failed to link guest to booking");
  },
};
