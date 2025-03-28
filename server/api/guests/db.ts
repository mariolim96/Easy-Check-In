import { db } from "../../db/db";
import type { CreateGuestParams, Guest, Member } from "./types";

export const guestQueries = {
  async createGuest(params: CreateGuestParams): Promise<Guest> {
    const result = db.query<Guest>`
      WITH inserted_guest AS (
        INSERT INTO guests (
          guest_type, arrival_date, stay_length, citizenship,
          place_of_birth, first_name, last_name, date_of_birth,
          gender, document_issue_place, document_type, document_number,
          created_at, updated_at
        ) VALUES (
          ${params.guestType}, ${params.arrivalDate}, ${params.stayLength},
          ${params.citizenship}, ${params.placeOfBirth}, ${params.firstName},
          ${params.lastName}, ${params.dateOfBirth}, ${params.gender},
          ${params.documentIssuePlace}, ${params.documentType},
          ${params.documentNumber}, NOW(), NOW()
        )
        RETURNING *
      )
      SELECT * FROM inserted_guest
    `;

    let guest: Guest | null = null;
    for await (const row of result) {
      guest = row;
    }

    if (!guest) {
      throw new Error("Failed to create guest");
    }

    // If there are members, insert them
    if (params.members && params.members.length > 0) {
      const memberResults = db.query<Member>`
        INSERT INTO guest_members (
          guest_id, stay_length, citizenship, place_of_birth,
          first_name, last_name, date_of_birth, gender, guest_type,
          created_at, updated_at
        )
        SELECT 
          ${guest.id}, m.stay_length, m.citizenship, m.place_of_birth,
          m.first_name, m.last_name, m.date_of_birth, m.gender, m.guest_type,
          NOW(), NOW()
        FROM jsonb_to_recordset(${JSON.stringify(params.members)}::jsonb) AS m(
          stay_length int,
          citizenship text,
          place_of_birth text,
          first_name text,
          last_name text,
          date_of_birth text,
          gender text,
          guest_type text
        )
        RETURNING *
      `;

      const members: Member[] = [];
      for await (const member of memberResults) {
        members.push(member);
      }
      guest.members = members;
    }

    return guest;
  },
};