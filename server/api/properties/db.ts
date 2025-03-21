import { db } from "../../db/db";
import type { AlloggiatiConfig, ApartmentInput, Property } from "./types";

export const propertyQueries = {
  async insertProperty(
    userId: string,
    name: string,
    address: string,
    hasSciaaLicense: boolean,
  ) {
    const result = db.query<{ id: string }>`
      INSERT INTO properties (
        user_id, name, address, has_sciaa_license, created_at, updated_at
      ) VALUES (${userId}, ${name}, ${address}, ${hasSciaaLicense}, NOW(), NOW())
      RETURNING id
    `;

    for await (const row of result) {
      return row.id;
    }
    throw new Error("Failed to get property ID after insertion");
  },

  async insertAlloggiatiConfig(propertyId: string, config: AlloggiatiConfig) {
    const result = db.query<{ id: string }>`
      INSERT INTO alloggiati_configs (
        property_id, username, password, ws_key, created_at, updated_at
      ) VALUES (
        ${propertyId}, ${config.username}, ${config.password}, ${config.wsKey},
        NOW(), NOW()
      )
      RETURNING id
    `;

    for await (const row of result) {
      return row.id;
    }
    throw new Error("Failed to insert alloggiati configuration");
  },

  async insertApartments(propertyId: string, apartments: ApartmentInput[]) {
    const apartmentPromises = apartments.map(
      (apt) => db.query<{ id: string; name: string }>`
        INSERT INTO apartments (
          property_id, name, max_guests, created_at, updated_at
        ) VALUES (${propertyId}, ${apt.name}, ${apt.maxGuests}, NOW(), NOW())
        RETURNING id, name
      `,
    );

    const results = await Promise.all(apartmentPromises);
    const createdApartments = [];

    for (const result of results) {
      for await (const row of result) {
        createdApartments.push({ id: row.id, name: row.name });
        break;
      }
    }

    return createdApartments;
  },

  async getPropertyByIdAndUser(
    propertyId: string,
    userId: string,
  ): Promise<Property | null> {
    const result = db.query<Property>`
      SELECT
        p.*,
        (
          SELECT json_agg(
            json_build_object(
              'id', a.id,
              'name', a.name,
              'maxGuests', a.max_guests
            )
          )
          FROM apartments a
          WHERE a.property_id = p.id
        ) as apartments
      FROM properties p
      WHERE p.id = ${propertyId}
        AND p.user_id = ${userId}
    `;

    for await (const row of result) {
      return { ...row, apartments: row.apartments || [] };
    }
    return null;
  },

  async getAllPropertiesByUser(userId: string): Promise<Property[]> {
    const result = db.query<Property>`
      SELECT 
        p.*,
        (
          SELECT json_agg(
            json_build_object(
              'id', a.id,
              'name', a.name,
              'maxGuests', a.max_guests
            )
          )
          FROM apartments a
          WHERE a.property_id = p.id
        ) as apartments
      FROM properties p
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
    `;

    const properties: Property[] = [];
    for await (const row of result) {
      properties.push({
        ...row,
        apartments: row.apartments || [],
      });
    }
    return properties;
  },

  async getAvailableProperties(
    userId: string,
    dateFrom?: string,
    dateTo?: string,
    guestCount?: number
  ) {
    let query = db.query<AvailableProperty>`
      WITH available_apartments AS (
        SELECT 
          a.id as apartment_id,
          a.name as apartment_name,
          a.max_guests,
          a.property_id,
          p.name as property_name
        FROM apartments a
        JOIN properties p ON p.id = a.property_id
        WHERE p.user_id = ${userId}
        AND (${guestCount}::int IS NULL OR a.max_guests >= ${guestCount})
        AND NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.apartment_id = a.id
          AND b.status NOT IN ('cancelled')
          AND (
            ${dateFrom}::timestamp IS NULL 
            OR ${dateTo}::timestamp IS NULL
            OR (
              b.check_out > ${dateFrom}::timestamp 
              AND b.check_in < ${dateTo}::timestamp
            )
          )
        )
      )
      SELECT 
        p.id,
        p.name,
        json_agg(
          json_build_object(
            'id', aa.apartment_id,
            'name', aa.apartment_name,
            'maxGuests', aa.max_guests
          )
        ) as apartments
      FROM properties p
      JOIN available_apartments aa ON aa.property_id = p.id
      GROUP BY p.id, p.name
    `;

    const properties: AvailableProperty[] = [];
    for await (const row of query) {
      properties.push(row);
    }
    return properties;
  },
};

