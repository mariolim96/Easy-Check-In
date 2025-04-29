import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import {
  type GenerateTokenParams,
  type GenerateTokenResponse,
  type AddApartmentParams,
  type AddApartmentResponse,
  type DisableApartmentParams,
  type DisableApartmentResponse,
  type AuthenticationTestParams,
  type AuthenticationTestResponse,
  type SendFileUnicoParams,
  type SendFileUnicoResponse,
  type SendApartmentParams,
  type SendApartmentResponse,
  type TabellaParams,
  type TabellaResponse,
  type SendParams,
  type SendResponse,
} from "./types";
import {
  generateTokenService,
  addApartmentService,
  disableApartmentService,
  testAuthenticationService,
  sendApartmentService,
  tabellaService,
  sendService,
  testService,
} from "./services";
import { GuestListItem, guestWithDocument } from "../guests/types";
import { STATI_MAP } from "@/constants/stati";
import { COMUNI_MAP } from "@/constants/comuni";
import { db } from "../../db/db";
import log from "encore.dev/log";

export const generateToken = api(
  { method: "POST", expose: true, auth: true },
  async (params: GenerateTokenParams): Promise<GenerateTokenResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await generateTokenService(params);
  },
);

// export const addApartment = api(
//   { method: "POST", expose: true },
//   async (params: AddApartmentParams): Promise<AddApartmentResponse> => {
//     const auth = getAuthData();
//     if (!auth?.userID) {
//       throw new Error("User not authenticated");
//     }

//     return await addApartmentService(params);
//   },
// );

// export const disableApartment = api(
//   { method: "POST", expose: true },
//   async (params: DisableApartmentParams): Promise<DisableApartmentResponse> => {
//     const auth = getAuthData();
//     if (!auth?.userID) {
//       throw new Error("User not authenticated");
//     }

//     return await disableApartmentService(params);
//   },
// );

export const testAuthentication = api(
  { method: "POST", expose: true },
  async (
    params: AuthenticationTestParams,
  ): Promise<AuthenticationTestResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await testAuthenticationService(params);
  },
);

// Alloggiato type codes according to the manual:
// 16 = single guest
// 17 = family head
// 18 = group leader
// 19 = family member
// 20 = group member
const mapAlloggiatoType = {
  single_guest: "16",
  family_head: "17",
  group_leader: "18",
  family_member: "19",
  group_member: "20",
};

const mapGender = {
  M: "1",
  F: "2",
};

/**
 * Pads a string to the specified length with hyphens
 * If the value is longer than the specified length, it will be truncated
 * This ensures that each field has exactly the specified length
 */
const pad = (value: string, length: number) => {
  if (!value) return "".padEnd(length, " ");
  // Truncate if longer than the specified length
  if (value.length > length) {
    return value.substring(0, length);
  }
  // Pad with hyphens if shorter
  return value.padEnd(length, " ");
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const getDaysOfStay = (checkIn: string, checkOut: string) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate.getTime() - inDate.getTime();
  return Math.min(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 30).toString();
};

/**
 * Formats a guest and its members into Alloggiati records
 * According to the SOAP example in the manual, each record should be 168 characters exactly
 * and sent as separate elements in an array
 */
function formatGuestToAlloggiatiRecord(guest: guestWithDocument): string[] {
  const records: string[] = [];

  if (guest.members && guest.members.length > 0) {
    // For groups/families, add the head/leader first
    records.push(formatSingleGuest(guest));

    // Then add all members
    guest.members.forEach((member) => {
      records.push(formatSingleGuest(member));
    });
  } else {
    // For single guests
    return [formatSingleGuest(guest)];
  }

  return records;
}

/**
 * Formats a single guest record according to the Alloggiati Web Service specification
 * Each record must be exactly 168 characters
 */
function formatSingleGuest(guest: guestWithDocument | GuestListItem): string {
  let isItalian = true;
  let placeOfBirth = COMUNI_MAP.get(guest.placeOfBirth);
  if (!placeOfBirth) {
    placeOfBirth = STATI_MAP.get(guest.placeOfBirth);
    if (placeOfBirth) {
      isItalian = false;
    }
  }

  const document =
    "document" in guest
      ? guest.document
      : {
          documentType: "",
          documentNumber: "",
          documentIssueCountry: "",
        };

  const documentIssueCountry =
    STATI_MAP.get(document.documentIssueCountry) ??
    COMUNI_MAP.get(document.documentIssueCountry);
  const citizenship = STATI_MAP.get(guest.citizenship) || undefined;
  if (!placeOfBirth || !citizenship) {
    throw new Error("Place of birth or citizenship not found");
  }

  const comuneNascita = isItalian ? pad(guest.placeOfBirth, 9) : pad("", 9);
  const provinciaNascita = isItalian
    ? pad(placeOfBirth?.Provincia, 2)
    : pad("", 2);
  const statoNascita = isItalian
    ? pad("100000100", 9)
    : pad(guest.placeOfBirth, 9);
  const days = getDaysOfStay(guest.checkIn, guest.checkOut);
  const daysOfStay = days.length === 1 ? "0" + days : days;

  // According to the Alloggiati Web Service manual:
  // - Total characters per guest record: 168 characters exactly
  // - Each record should be followed by CR+LF (except the last one)
  // - Field format:
  //   - Tipo Alloggiato (2 chars)
  //   - Data Arrivo (10 chars - DD/MM/YYYY)
  //   - Numero Giorni di Permanenza (2 chars)
  //   - Cognome (50 chars)
  //   - Nome (30 chars)
  //   - Sesso (1 char: 1=M, 2=F)
  //   - Data Nascita (10 chars - DD/MM/YYYY)
  //   - Comune Nascita (9 chars)
  //   - Provincia Nascita (2 chars)
  //   - Stato Nascita (9 chars)
  //   - Cittadinanza (9 chars)
  //   - Tipo Documento (5 chars)
  //   - Numero Documento (20 chars)
  //   - Luogo Rilascio Documento (9 chars)

  // Build the record with exact field lengths
  const record =
    pad(
      mapAlloggiatoType[guest.guestType as keyof typeof mapAlloggiatoType],
      2,
    ) + // Tipo Alloggiato (2)
    formatDate(guest.checkIn) + // Data Arrivo (10)
    daysOfStay + // Numero Giorni di Permanenza (2)
    pad(guest.lastName.toUpperCase(), 50) + // Cognome (50)
    pad(guest.firstName.toUpperCase(), 30) + // Nome (30)
    mapGender[guest.gender as keyof typeof mapGender] + // Sesso (1)
    formatDate(guest.dateOfBirth) + // Data Nascita (10)
    comuneNascita + // Comune Nascita (9)
    provinciaNascita + // Provincia Nascita (2)
    statoNascita + // Stato Nascita (9)
    pad(citizenship.Codice, 9) + // Cittadinanza (9)
    pad(document.documentType, 5) + // Tipo Documento (5)
    pad(document.documentNumber, 20) + // Numero Documento (20)
    pad(documentIssueCountry ? `${documentIssueCountry.Codice}` : "", 9); // Luogo Rilascio Documento (9)

  // Verify the record length is exactly 168 characters
  if (record.length !== 168) {
    log.error("Invalid record length", {
      expected: 168,
      actual: record.length,
      record: record,
    });
    throw new Error(`Invalid record length: ${record.length}, expected 168`);
  }

  // Return the record without CR+LF
  // The SOAP service expects an array of strings, each exactly 168 characters
  return record;
}

async function getAlloggiatiCredentials(propertyId: string) {
  const result = await db.queryRow<{
    username: string;
    password: string;
    wskey: string;
  }>`
    SELECT
      username,
      password,
      ws_key as wskey
    FROM alloggiati_configs
    WHERE property_id = ${propertyId}
  `;

  if (!result) {
    throw new Error("Alloggiati credentials not found for property");
  }

  return result;
}

export const sendFileUnico = api(
  { method: "POST", expose: true, auth: true },
  async (
    params: SendFileUnicoParams,
  ): Promise<{ guest: string[]; response: any }> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      log.error("Authentication failed", { userId: auth?.userID });
      throw new Error("User not authenticated");
    }

    log.info("Starting sendFileUnico process", {
      userId: auth.userID,
      propertyId: params.ElencoSchedine.property.id,
      guestData: JSON.stringify(params.ElencoSchedine),
    });

    // Get property ID from the guest data
    const propertyId = params.ElencoSchedine.property.id;

    // Get Alloggiati credentials from database
    const credentials = await getAlloggiatiCredentials(propertyId);

    // Generate token
    const tokenResponse = await generateTokenService({
      Utente: credentials.username,
      Password: credentials.password,
      WsKey: credentials.wskey,
    });

    // Format guest data
    const guestsToSend = formatGuestToAlloggiatiRecord(params.ElencoSchedine);

    log.info("Formatted guest data", {
      propertyId,
      guestCount: guestsToSend.length,
      formattedData: guestsToSend,
    });

    if (!guestsToSend.length) {
      log.error("No guests to send after formatting", {
        propertyId,
        originalGuest: params.ElencoSchedine,
      });
      throw new Error("No guest data to send");
    }

    // According to the SOAP example in the manual, ElencoSchedine should be an array of strings
    // Each string should be exactly 168 characters (without CR+LF)
    // The SOAP service expects an array of strings, not a single concatenated string

    // Each record is already exactly 168 characters without CR+LF
    // We'll use these records directly as array elements in the SOAP request
    const cleanedRecords = guestsToSend;

    // Log the exact formatted data being sent
    log.info("Sending formatted data to Alloggiati service", {
      propertyId,
      recordCount: cleanedRecords.length,
      recordLengths: cleanedRecords.map((record) => record.length),
      records: cleanedRecords,
    });

    // Call test service with generated token
    const response = await testService({
      Utente: credentials.username,
      token: tokenResponse.token,
      ElencoSchedine: cleanedRecords, // Send as array of strings
    });

    log.info("Test service response", {
      propertyId,
      response: response,
    });

    // If test was successful, send the actual data using the send service
    if (response.success) {
      log.info("Test successful, sending data to production service", {
        propertyId,
      });

      // Call the production service with the same cleaned records
      log.info("Calling production service with formatted data", {
        propertyId,
        recordCount: cleanedRecords.length,
      });

      const prodResponse = await sendService({
        Utente: credentials.username,
        token: tokenResponse.token,
        ElencoSchedine: cleanedRecords, // Send as array of strings
      });

      log.info("Production service response", {
        propertyId,
        response: prodResponse,
      });

      return {
        guest: guestsToSend,
        response: prodResponse,
      };
    }

    // Return both the formatted guest data and the response
    return {
      guest: guestsToSend, // Return the actual formatted guest data
      response: response,
    };
  },
);

// export const sendFileUnico1 = api(
//   { method: "POST", expose: true },
//   async (
//     params: SendFileUnicoParams,
//   ): Promise<{
//     schedineValide: number;
//     errors: string[];
//     success: boolean;
//   }> => {
//     // const auth = getAuthData();
//     // if (!auth?.userID) {
//     //   throw new Error("User not authenticated");
//     // }
//     const guestsToSend = formatGuestToAlloggiatiRecord(params.ElencoSchedine);

//     const result = await sendFileUnicoService({
//       Utente: params.Utente,
//       token: params.token,
//       ElencoSchedine: guestsToSend,
//     });
//     return result;
//   },
// );
// export const sendApartment = api(
//   { method: "POST", expose: true },
//   async (params: SendApartmentParams): Promise<SendApartmentResponse> => {
//     const auth = getAuthData();
//     if (!auth?.userID) {
//       throw new Error("User not authenticated");
//     }

//     return await sendApartmentService(params);
//   },
// );

// export const getTabella = api(
//   { method: "POST", expose: true },
//   async (params: TabellaParams): Promise<TabellaResponse> => {
//     const auth = getAuthData();
//     if (!auth?.userID) {
//       throw new Error("User not authenticated");
//     }

//     return await tabellaService(params);
//   },
// );

export const send = api(
  { method: "POST", expose: true },
  async (params: SendParams): Promise<SendResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await sendService(params);
  },
);
