import { api, APIError } from "encore.dev/api";
import { guestQueries } from "./db";
import type {
  CreateGuestWithBookingParams,
  GuestResponse,
  ListGuestsResponse,
} from "./types";
import { db } from "../../db/db";
import { getAuthData } from "~encore/auth";

// export const createGuestWithBooking = api(
//   { method: "POST", path: "/guests/booking", expose: true },
//   async (params: CreateGuestWithBookingParams): Promise<GuestResponse> => {
//     try {
//       // Start a transaction since we're making multiple related insertions
//       await db.exec`BEGIN`;

//       // Create the guest
//       const guest = await guestQueries.createGuest(params.guest);

//       // Create the guest's document
//       const document = await guestQueries.createGuestDocument(
//         guest.id,
//         params.guest.document,
//       );

//       // Link the guest to the booking
//       await guestQueries.linkGuestToBooking({
//         bookingId: params.bookingId,
//         guestId: guest.id,
//         guestType: params.guestType,
//         checkIn: params.checkIn,
//         checkOut: params.checkOut,
//       });

//       // Commit the transaction
//       await db.exec`COMMIT`;

//       return {
//         guest,
//         document: {
//           documentIssueDate: document.document_issue_date,
//           documentExpiryDate: document.document_expiry_date,
//           documentIssuePlace: document.document_issue_place,
//           documentType: document.document_type,
//           documentNumber: document.document_number,
//           documentScan: document.document_scan,
//           documentIssueCountry: document.document_issue_country
//         }
//       };
//     } catch (error) {
//       // Rollback in case of any error
//       await db.exec`ROLLBACK`;
//       throw APIError.internal("Failed to create guest and link to booking").withDetails({
//           cause: error,
//           name: "",
//           message: ""
//       });
//     }
//   },
// );

export const createGuestWithBooking = api(
  { method: "POST", path: "/guests/booking", expose: true },
  async (params: CreateGuestWithBookingParams): Promise<GuestResponse> => {
    try {
      // Start a transaction since we're making multiple related insertions
      await db.exec`BEGIN`;

      // Create the main guest
      const guest = await guestQueries.createGuest(params.guest);

      // Create the guest's document
      if (!params.guest.document) {
        throw new Error("Guest document is required");
      }
      const document = await guestQueries.createGuestDocument(
        guest.id,
        params.guest.document,
      );

      // Link the main guest to the booking
      await guestQueries.linkGuestToBooking({
        bookingId: params.bookingId,
        guestId: guest.id,
        guestType: params.guestType,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
      });

      // If there are additional members, create them and link them to the booking
      if (params.guest.members && params.guest.members.length > 0) {
        for (const member of params.guest.members) {
          const memberGuest = await guestQueries.createGuest({
            firstName: member.firstName,
            lastName: member.lastName,
            gender: member.gender,
            dateOfBirth: member.dateOfBirth,
            placeOfBirth: member.placeOfBirth,
            nationality: member.citizenship,
          });

          await guestQueries.linkGuestToBooking({
            bookingId: params.bookingId,
            guestId: memberGuest.id,
            guestType: member.guestType,
            checkIn: member.arrivalDate,
            checkOut: member.checkOut,
          });
        }
      }

      // Commit the transaction
      await db.exec`COMMIT`;

      return {
        guest,
        document: {
          documentIssueDate: document.document_issue_date,
          documentExpiryDate: document.document_expiry_date,
          documentIssuePlace: document.document_issue_place,
          documentType: document.document_type,
          documentNumber: document.document_number,
          documentScan: document.document_scan,
          documentIssueCountry: document.document_issue_country,
        },
      };
    } catch (error) {
      // Rollback in case of any error
      await db.exec`ROLLBACK`;
      throw APIError.internal("Failed to create guest and link to booking", {
        cause: error,
        name: "DatabaseError",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

export const listGuests = api(
  { method: "GET", path: "/guests", expose: true, auth: true },
  async (): Promise<ListGuestsResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw APIError.unauthenticated("User not authenticated");
    }

    try {
      const guests = await guestQueries.listGuests(auth.userID);
      return { guests };
    } catch (error) {
      throw APIError.internal("Failed to fetch guests", {
        cause: error,
        name: "DatabaseError",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);
