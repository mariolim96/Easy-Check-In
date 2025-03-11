// import { api } from "encore.dev/api";
// export interface Property {
//   id: string;
//   name: string;
//   type: "apartment" | "house";
//   location: string;
//   description?: string;
//   amenities?: string[];
//   price?: string;
//   bedrooms?: number;
//   bathrooms?: number;
//   squareFeet?: number;
//   yearBuilt?: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface ListPropertiesParams {
//   search?: string;
//   type?: "apartment" | "house";
//   limit?: number;
//   offset?: number;
// }

// export interface CreatePropertyParams {
//   name: string;
//   type: "apartment" | "house";
//   location: string;
//   description?: string;
//   amenities?: string[];
//   price?: string;
//   bedrooms?: number;
//   bathrooms?: number;
//   squareFeet?: number;
//   yearBuilt?: number;
// }
// // Mock data
// const mockProperties: Property[] = [
//   {
//     id: "1",
//     name: "Luxury Apartment",
//     type: "apartment",
//     location: "Downtown",
//     description: "A beautiful luxury apartment in the heart of downtown",
//     amenities: ["Pool", "Gym", "Parking", "Security"],
//     price: "$2,500/month",
//     bedrooms: 2,
//     bathrooms: 2,
//     squareFeet: 1200,
//     yearBuilt: 2020,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "2",
//     name: "Family House",
//     type: "house",
//     location: "Suburbs",
//     description: "Spacious family home in a quiet neighborhood",
//     amenities: ["Garden", "Garage", "Fireplace"],
//     price: "$3,500/month",
//     bedrooms: 4,
//     bathrooms: 3,
//     squareFeet: 2500,
//     yearBuilt: 2018,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// // List properties
// export const list = api<ListPropertiesParams, { properties: Property[] }>(
//   { method: "GET", path: "/properties", expose: true },
//   async ({ search, type, limit = 10, offset = 0 }) => {
//     let filtered = [...mockProperties];

//     if (search) {
//       const searchLower = search.toLowerCase();
//       filtered = filtered.filter(
//         (p) =>
//           p.name.toLowerCase().includes(searchLower) ||
//           p.location.toLowerCase().includes(searchLower),
//       );
//     }

//     if (type) {
//       filtered = filtered.filter((p) => p.type === type);
//     }

//     return {
//       properties: filtered.slice(offset, offset + limit),
//     };
//   },
// );

// // Get property by ID
// export const get = api<{ id: string }, { property: Property }>(
//   { method: "GET", path: "/properties/:id", expose: true },
//   async ({ id }) => {
//     const property = mockProperties.find((p) => p.id === id);
//     if (!property) {
//       throw new Error("Property not found");
//     }
//     return { property };
//   },
// );

// // Create property
// export const create = api<CreatePropertyParams, { property: Property }>(
//   { method: "POST", path: "/properties", expose: true },
//   async (params) => {
//     const newProperty: Property = {
//       id: String(mockProperties.length + 1),
//       ...params,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//     mockProperties.push(newProperty);
//     return { property: newProperty };
//   },
// );
