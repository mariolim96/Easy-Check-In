import { db } from "../../db/db";
import type {
  CreateGuestParams,
  Guest,
  GuestDocument,
  CreateBookingGuestParams,
  GuestListItem,
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

  async listGuests(userId: string): Promise<GuestListItem[]> {
    const result = db.query<GuestListItem>`
      WITH RECURSIVE member_hierarchy AS (
        -- Base case: Get all group leaders and family heads
        SELECT 
          g.id,
          g.first_name,
          g.last_name,
          g.gender,
          g.date_of_birth,
          g.nationality as citizenship,
          g.place_of_birth,
          bg.guest_type,
          bg.check_in,
          bg.check_out,
          bg.booking_id,
          gd.document_type,
          gd.document_number,
          gd.document_issue_country,
          p.id as property_id,
          p.name as property_name,
          a.id as apartment_id,
          a.name as apartment_name,
          COALESCE(
            CASE 
              WHEN aws.status IS NOT NULL THEN aws.status
              ELSE 'pending'
            END,
            'pending'
          ) as alloggiati_status,
          NULL::uuid as parent_id
        FROM guests g
        JOIN booking_guests bg ON g.id = bg.guest_id
        JOIN bookings b ON bg.booking_id = b.id
        JOIN apartments a ON b.apartment_id = a.id
        JOIN properties p ON a.property_id = p.id
        LEFT JOIN guest_documents gd ON g.id = gd.guest_id
        LEFT JOIN alloggiati_submissions aws ON bg.alloggiati_submission_id = aws.id
        WHERE bg.guest_type IN ('group_leader', 'family_head', 'single_guest')
        AND p.user_id = ${userId}

        UNION ALL

        -- Recursive case: Get all members
        SELECT 
          g.id,
          g.first_name,
          g.last_name,
          g.gender,
          g.date_of_birth,
          g.nationality as citizenship,
          g.place_of_birth,
          bg.guest_type,
          bg.check_in,
          bg.check_out,
          bg.booking_id,
          gd.document_type,
          gd.document_number,
          gd.document_issue_country,
          p.id,
          p.name,
          a.id,
          a.name,
          COALESCE(
            CASE 
              WHEN aws.status IS NOT NULL THEN aws.status
              ELSE 'pending'
            END,
            'pending'
          ),
          CASE 
            WHEN bg.guest_type = 'family_member' THEN (
              SELECT guest_id 
              FROM booking_guests 
              WHERE booking_id = bg.booking_id 
              AND guest_type = 'family_head'
              LIMIT 1
            )
            WHEN bg.guest_type = 'group_member' THEN (
              SELECT guest_id 
              FROM booking_guests 
              WHERE booking_id = bg.booking_id 
              AND guest_type = 'group_leader'
              LIMIT 1
            )
          END
        FROM guests g
        JOIN booking_guests bg ON g.id = bg.guest_id
        JOIN bookings b ON bg.booking_id = b.id
        JOIN apartments a ON b.apartment_id = a.id
        JOIN properties p ON a.property_id = p.id
        LEFT JOIN guest_documents gd ON g.id = gd.guest_id
        LEFT JOIN alloggiati_submissions aws ON bg.alloggiati_submission_id = aws.id
        WHERE bg.guest_type IN ('family_member', 'group_member')
        AND p.user_id = ${userId}
      )
      SELECT
        id,
        first_name as "firstName",
        last_name as "lastName",
        gender,
        date_of_birth as "dateOfBirth",
        citizenship,
        place_of_birth as "placeOfBirth",
        guest_type as "guestType",
        check_in as "checkIn",
        check_out as "checkOut",
        booking_id as "bookingId",
        json_build_object(
          'documentType', document_type,
          'documentNumber', document_number,
          'documentIssueCountry', document_issue_country
        ) as document,
        json_build_object(
          'id', property_id,
          'name', property_name,
          'apartment', json_build_object(
            'id', apartment_id,
            'name', apartment_name
          )
        ) as property,
        alloggiati_status as "alloggiatiStatus",
        parent_id
      FROM member_hierarchy
      ORDER BY booking_id, parent_id NULLS FIRST, guest_type
    `;

    const guests: GuestListItem[] = [];
    const guestMap = new Map<string, GuestListItem>();

    for await (const row of result) {
      const guest = { ...row, members: [] };

      if (row.parent_id) {
        // This is a member, add it to the parent's members array
        const parent = guestMap.get(row.parent_id);
        if (parent) {
          parent.members?.push(guest);
        }
      } else {
        // This is a main guest
        guestMap.set(row.id, guest);
        guests.push(guest);
      }
    }

    return guests;
  },

  //   async listGuests2(userId: string): Promise<GuestListItem[]> {
  //     const result = db.query<GuestListItem>`
  //       WITH RECURSIVE guest_hierarchy AS (
  //         -- First select all main guests (leaders, heads, singles)
  //         SELECT
  //           g.id,
  //           g.first_name as "firstName",
  //           g.last_name as "lastName",
  //           bg.guest_type as "guestType",
  //           bg.check_in as "checkIn",
  //           bg.check_out as "checkOut",
  //           bg.booking_id as "bookingId",
  //           p.id as property_id,
  //           p.name as property_name,
  //           a.id as apartment_id,
  //           a.name as apartment_name,
  //           CASE
  //             WHEN aws.id IS NOT NULL THEN 'submitted'
  //             ELSE 'pending'
  //           END as "alloggiatiStatus",
  //           aws.submission_date as "submittedAt",
  //           aws.response_data->>'receipt_url' as "alloggiatiWebReceiptUrl",
  //           gd.document_type as "documentType",
  //           gd.document_number as "documentNumber",
  //           gd.document_issue_country as "documentIssueCountry",
  //           NULL as parent_id
  //         FROM guests g
  //         JOIN booking_guests bg ON g.id = bg.guest_id
  //         JOIN bookings b ON bg.booking_id = b.id
  //         JOIN apartments a ON b.apartment_id = a.id
  //         JOIN properties p ON a.property_id = p.id
  //         LEFT JOIN guest_documents gd ON g.id = gd.guest_id
  //         LEFT JOIN alloggiati_submissions aws ON bg.alloggiati_submission_id = aws.id
  //         WHERE bg.guest_type IN ('group_leader', 'family_head', 'single_guest')
  //         AND p.user_id = ${userId}

  //         UNION ALL

  //         -- Then select all members and link them to their leaders/heads
  //         SELECT
  //           g.id,
  //           g.first_name,
  //           g.last_name,
  //           bg.guest_type,
  //           bg.check_in,
  //           bg.check_out,
  //           bg.booking_id,
  //           p.id,
  //           p.name,
  //           a.id,
  //           a.name,
  //           CASE
  //             WHEN aws.id IS NOT NULL THEN 'submitted'
  //             ELSE 'pending'
  //           END,
  //           aws.submission_date,
  //           aws.response_data->>'receipt_url',
  //           gd.document_type,
  //           gd.document_number,
  //           gd.document_issue_country,
  //           CASE
  //             WHEN bg.guest_type = 'family_member' THEN (
  //               SELECT guest_id
  //               FROM booking_guests
  //               WHERE booking_id = bg.booking_id
  //               AND guest_type = 'family_head'
  //               LIMIT 1
  //             )
  //             WHEN bg.guest_type = 'group_member' THEN (
  //               SELECT guest_id
  //               FROM booking_guests
  //               WHERE booking_id = bg.booking_id
  //               AND guest_type = 'group_leader'
  //               LIMIT 1
  //             )
  //           END
  //         FROM guests g
  //         JOIN booking_guests bg ON g.id = bg.guest_id
  //         JOIN bookings b ON bg.booking_id = b.id
  //         JOIN apartments a ON b.apartment_id = a.id
  //         JOIN properties p ON a.property_id = p.id
  //         LEFT JOIN guest_documents gd ON g.id = gd.guest_id
  //         LEFT JOIN alloggiati_submissions aws ON bg.alloggiati_submission_id = aws.id
  //         WHERE bg.guest_type IN ('family_member', 'group_member')
  //         AND p.user_id = ${userId}
  //       )
  //       SELECT
  //         id,
  //         first_name as "firstName",
  //         last_name as "lastName",
  //         guest_type as "guestType",
  //         check_in as "checkIn",
  //         check_out as "checkOut",
  //         booking_id as "bookingId",
  //         json_build_object(
  //           'documentType', document_type,
  //           'documentNumber', document_number,
  //           'documentIssueCountry', document_issue_country
  //         ) as document,
  //         json_build_object(
  //           'id', property_id,
  //           'name', property_name,
  //           'apartment', json_build_object(
  //             'id', apartment_id,
  //             'name', apartment_name
  //           )
  //         ) as property,
  //         alloggiati_status as "alloggiatiStatus",
  //         submitted_at as "submittedAt",
  //         alloggiati_web_receipt_url as "alloggiatiWebReceiptUrl",
  //         parent_id
  //       FROM guest_hierarchy
  //       ORDER BY booking_id, parent_id NULLS FIRST, guest_type
  //     `;

  //     const guests: GuestListItem[] = [];
  //     const guestMap = new Map<string, GuestListItem>();

  //     for await (const row of result) {
  //       const guest = { ...row };
  //       guestMap.set(guest.id, guest);

  //       if (row.parent_id) {
  //         const parent = guestMap.get(row.parent_id);
  //         if (parent) {
  //           if (!parent.members) parent.members = [];
  //           parent.members.push(guest);
  //         }
  //       } else {
  //         guests.push(guest);
  //       }
  //     }

  //     return guests;
  //   },
};
