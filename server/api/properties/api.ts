import { api } from "encore.dev/api";
import { db } from "../../db/db";
import { getAuthData } from "~encore/auth";

// Property interface
interface Property {
  id: string;
  userId: string;
  name: string;
  nomeAlloggiatiWeb: string;
  rooms: number;
  beds: number;
  touristTax: number;
  isActive: boolean;
  createdAt: Date;
}

// Create Property
interface CreatePropertyParams {
  name: string;
  nomeAlloggiatiWeb: string;
  rooms: number;
  beds: number;
  touristTax: number;
}

interface CreatePropertyResponse {
  id: string;
  message: string;
}

export const createProperty = api(
  { method: "POST", expose: true },
  async (params: CreatePropertyParams) => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    const result = await db.exec`
      INSERT INTO properties (
        user_id, 
        name, 
        nome_alloggiati_web, 
        rooms, 
        beds, 
        tourist_tax, 
        is_active
      )
      VALUES (
        ${auth.userID}, 
        ${params.name}, 
        ${params.nomeAlloggiatiWeb}, 
        ${params.rooms}, 
        ${params.beds}, 
        ${params.touristTax}, 
        true
      )
      RETURNING id
    `;

    return {
      id: result,
      message: "Property created successfully",
    };
  },
);

// List Properties
interface ListPropertiesResponse {
  properties: Property[];
}

export const listProperties = api(
  { method: "GET", expose: true },
  async (): Promise<ListPropertiesResponse> => {
    const properties: Property[] = [];
    const auth = getAuthData();

    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    for await (const row of db.query`
      SELECT 
        id,
        user_id as "userId",
        name,
        nome_alloggiati_web as "nomeAlloggiatiWeb",
        rooms,
        beds,
        tourist_tax as "touristTax",
        is_active as "isActive",
        created_at as "createdAt"
      FROM properties
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `) {
      properties.push(row as Property);
    }

    return { properties };
  },
);

// Get Property
// interface GetPropertyParams {
//     propertyId: string;
// }

// export const getProperty = api(
//     { method: "GET", expose: true },
//     async (params: GetPropertyParams): Promise<Property> => {
//         const result = await db.query`
//             SELECT * FROM properties WHERE id = ${params.propertyId}
//         `;

//         if (!result[0]) {
//             throw new Error("Property not found");
//         }

//         return result[0];
//     }
// );

// // Update Property
// interface UpdatePropertyParams {
//     propertyId: string;
//     title?: string;
//     description?: string;
//     address?: string;
// }

// export const updateProperty = api(
//     { method: "PUT", expose: true },
//     async (params: UpdatePropertyParams): Promise<Property> => {
//         let updates = [];
//         if (params.title) updates.push(sql`title = ${params.title}`);
//         if (params.description) updates.push(sql`description = ${params.description}`);
//         if (params.address) updates.push(sql`address = ${params.address}`);

//         const updateQuery = updates.join(", ");

//         const result = await db.query`
//             UPDATE properties
//             SET ${sql.raw(updateQuery)}
//             WHERE id = ${params.propertyId}
//             RETURNING *
//         `;

//         if (!result[0]) {
//             throw new Error("Property not found");
//         }

//         return result[0];
//     }
// );

// // Delete Property
// interface DeletePropertyParams {
//     propertyId: string;
// }

// export const deleteProperty = api(
//     { method: "DELETE", expose: true },
//     async (params: DeletePropertyParams): Promise<void> => {
//         await db.query`
//             DELETE FROM properties WHERE id = ${params.propertyId}
//         `;
//     }
// );

// // New interface for disable/enable property
// interface TogglePropertyStatusParams {
//     propertyId: string;
//     disabled: boolean;
// }

// export const togglePropertyStatus = api(
//     { method: "POST", expose: true },
//     async (params: TogglePropertyStatusParams): Promise<Property> => {
//         const result = await db.query`
//             UPDATE properties
//             SET disabled = ${params.disabled}
//             WHERE id = ${params.propertyId}
//             RETURNING *
//         `;

//         const property = await result.next();
//         if (!property) {
//             throw new Error("Property not found");
//         }

//     return property as Property;
//   }
// );
