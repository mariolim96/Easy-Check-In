import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../../db/db";

export interface CreatePropertyParams {
  name: string;
  address: string;
  hasSciaaLicense: boolean;
  alloggiatiConfig: {
    username: string;
    password: string;
    wsKey: string;
  };
  apartments: {
    name: string;
    maxGuests: number;
  }[];
}

export interface CreatePropertyResponse {
  id: string;
  apartments: {
    id: string;
    name: string;
  }[];
}

export const createProperty = api(
  { method: "POST", expose: true, auth: true },
  async (params: CreatePropertyParams): Promise<CreatePropertyResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw APIError.unauthenticated("User not authenticated");
    }

    try {
      // Start transaction
      await db.query`BEGIN`;

      // Log the incoming parameters for debugging
      console.log(
        "Creating property with params:",
        JSON.stringify(params, null, 2),
      );

      // Insert property
      const propertyResult = await db.query<{ id: string }>`
        INSERT INTO properties (
          user_id,
          name,
          address,
          has_sciaa_license,
          created_at,
          updated_at
        ) VALUES (${auth.userID}, ${params.name}, ${params.address}, ${params.hasSciaaLicense}, NOW(), NOW())
        RETURNING id
      `;

      let propertyId = "";
      for await (const row of propertyResult) {
        propertyId = row.id;
        break;
      }

      if (!propertyId) {
        throw new Error("Failed to get property ID after insertion");
      }

      console.log("Property created with ID:", propertyId);

      try {
        // Insert alloggiati config
        await db.query`
          INSERT INTO alloggiati_configs (
            property_id,
            username,
            password,
            ws_key,
            created_at,
            updated_at
          ) VALUES (
            ${propertyId},
            ${params.alloggiatiConfig.username},
            ${params.alloggiatiConfig.password},
            ${params.alloggiatiConfig.wsKey},
            NOW(),
            NOW()
          )
        `;

        console.log("Alloggiati config created for property:", propertyId);
      } catch (error) {
        console.error("Failed to insert alloggiati config:", error);
        throw error;
      }

      try {
        // Insert apartments
        const apartmentPromises = params.apartments.map(
          (apt) =>
            db.query<{ id: string; name: string }>`
            INSERT INTO apartments (
              property_id,
              name,
              max_guests,
              created_at,
              updated_at
            ) VALUES (${propertyId}, ${apt.name}, ${apt.maxGuests}, NOW(), NOW())
            RETURNING id, name
          `,
        );

        const apartmentResults = await Promise.all(apartmentPromises);
        const apartments = [];
        for (const apartmentResult of apartmentResults) {
          for await (const row of apartmentResult) {
            apartments.push({
              id: row.id,
              name: row.name,
            });
            break;
          }
        }

        console.log("Apartments created:", apartments);

        // Commit transaction
        await db.query`COMMIT`;

        return {
          id: propertyId,
          apartments,
        };
      } catch (error) {
        console.error("Failed to insert apartments:", error);
        throw error;
      }
    } catch (error) {
      // Rollback transaction on error
      await db.query`ROLLBACK`;

      console.error("Create property error details:", {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        message: error instanceof Error ? error.message : "Unknown error",
      });

      throw APIError.internal("Failed to create property", {
        cause: error,
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

export interface Property {
  id: string;
  name: string;
  address: string;
  has_sciaa_license: boolean;
  apartments: {
    id: string;
    name: string;
    maxGuests: number;
  }[];
}

export const getProperties = api(
  { method: "GET", expose: true, auth: true },
  async (): Promise<{ properties: Property[] }> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw APIError.unauthenticated("User not authenticated");
    }

    try {
      const result = await db.query<Property>`
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
        WHERE p.user_id = ${auth.userID}
        ORDER BY p.created_at DESC
      `;

      const properties: Property[] = [];
      for await (const row of result) {
        properties.push({
          id: row.id,
          name: row.name,
          address: row.address,
          has_sciaa_license: row.has_sciaa_license,
          apartments: row.apartments || [], // Use empty array if no apartments found
        });
      }

      return { properties };
    } catch (error) {
      console.error("Database error:", error);
      throw APIError.internal("Failed to fetch properties", {
        cause: error,
        name: "DatabaseError",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

export interface GetPropertyParams {
  propertyId: string;
}

export interface GetPropertyResponse {
  property: Property;
}

export const getProperty = api(
  { method: "GET", expose: true, auth: true },
  async (params: GetPropertyParams): Promise<GetPropertyResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw APIError.unauthenticated("User not authenticated");
    }

    const result = await db.query<{
      id: string;
      name: string;
      address: string;
      has_sciaa_license: boolean;
      apartments: Array<{
        id: string;
        name: string;
        maxGuests: number;
      }> | null;
    }>`
      SELECT
        p.id,
        p.name,
        p.address,
        p.has_sciaa_license,
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
      WHERE p.id = ${params.propertyId}
        AND p.user_id = ${auth.userID}
    `;

    let property = null;
    for await (const row of result) {
      property = row;
      break;
    }

    if (!property) {
      throw APIError.notFound("Property not found");
    }

    return {
      property: {
        ...property,
        apartments: property.apartments || [],
      },
    };
  },
);

// export const listProperties = api(
//   { method: "GET", expose: true, auth: true },
//   async () => {
//     const auth = getAuthData();
//     if (!auth?.userID) {
//       throw APIError.unauthenticated("User not authenticated");
//     }

//     const result = await db.query`
//       SELECT
//         p.id,
//         p.name,
//         p.address,
//         p.has_sciaa_license as hasSciaaLicense,
//         ac.username as alloggiati_username,
//         ac.password as alloggiati_password,
//         ac.ws_key as alloggiati_ws_key,
//         (
//           SELECT json_agg(
//             json_build_object(
//               'id', a.id,
//               'name', a.name,
//               'maxGuests', a.max_guests
//             )
//           )
//           FROM apartments a
//           WHERE a.property_id = p.id
//         ) as apartments
//       FROM properties p
//       LEFT JOIN alloggiati_configs ac ON ac.property_id = p.id
//       WHERE p.user_id = ${auth.userID}
//       ORDER BY p.created_at DESC
//     `;

//     const properties:  = [];
//     for await (const row of result) {
//       properties.push({
//         id: row.id,
//         name: row.name,
//         address: row.address,
//         hasSciaaLicense: row.hassciaalicense,
//         alloggiatiConfig: {
//           username: row.alloggiati_username,
//           password: row.alloggiati_password,
//           wsKey: row.alloggiati_ws_key,
//         },
//         apartments: row.apartments || [],
//       });
//     }

//     return {
//       properties,
//     };
//   },
// );
