import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { propertyQueries } from "./db";
import { db } from "../../db/db";
import type {
  CreatePropertyParams,
  CreatePropertyResponse,
  GetPropertyParams,
  GetPropertyResponse,
  Property,
  GetAvailablePropertiesParams,
  GetAvailablePropertiesResponse,
} from "./types";

const validateAuth = () => {
  const auth = getAuthData();
  if (!auth?.userID) {
    throw APIError.unauthenticated("User not authenticated");
  }
  return auth.userID;
};

export const createProperty = api(
  { method: "POST", expose: true, auth: true },
  async (params: CreatePropertyParams): Promise<CreatePropertyResponse> => {
    const userId = validateAuth();

    try {
      await db.exec`BEGIN`;

      console.log("Creating property with params:", {
        userId,
        name: params.name,
        address: params.address,
        hasSciaaLicense: params.hasSciaaLicense,
      });

      const propertyId = await propertyQueries.insertProperty(
        userId,
        params.name,
        params.address,
        params.hasSciaaLicense,
      );

      console.log("Property created with ID:", propertyId);

      console.log("Inserting alloggiati config");
      await propertyQueries.insertAlloggiatiConfig(
        propertyId,
        params.alloggiatiConfig,
      );

      console.log("Inserting apartments");
      const apartments = await propertyQueries.insertApartments(
        propertyId,
        params.apartments,
      );

      console.log("Apartments created:", apartments);

      await db.exec`COMMIT`;
      return { id: propertyId, apartments };
    } catch (error) {
      console.error("Failed to create property:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      });

      await db.exec`ROLLBACK`;

      throw APIError.internal("Failed to create property").withDetails({
        cause: error,
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
        params,
        userId,
      });
    }
  },
);

export const getProperties = api(
  { method: "GET", expose: true, auth: true },
  async (): Promise<{ properties: Property[] }> => {
    const userId = validateAuth();

    try {
      const properties = await propertyQueries.getAllPropertiesByUser(userId);
      return { properties };
    } catch (error) {
      throw APIError.internal("Failed to fetch properties", {
        cause: error,
        name: "DatabaseError",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

export const getProperty = api(
  { method: "GET", expose: true, auth: true },
  async (params: GetPropertyParams): Promise<GetPropertyResponse> => {
    const userId = validateAuth();

    const property = await propertyQueries.getPropertyByIdAndUser(
      params.propertyId,
      userId,
    );
    if (!property) {
      throw APIError.notFound("Property not found");
    }

    return { property };
  },
);

export const getAvailableProperties = api(
  { method: "GET", path: "/properties/available", expose: true, auth: true },
  async (params: GetAvailablePropertiesParams): Promise<GetAvailablePropertiesResponse> => {
    const userId = validateAuth();

    try {
      const availableProperties = await propertyQueries.getAvailableProperties(
        userId,
        params.dateFrom,
        params.dateTo,
        params.guestCount
      );
      
      return { properties: availableProperties };
    } catch (error) {
      throw APIError.internal("Failed to fetch available properties", {
        cause: error,
        name: "DatabaseError",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

