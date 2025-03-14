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
} from "./types";
import {
  generateTokenService,
  addApartmentService,
  disableApartmentService,
  testAuthenticationService,
  sendFileUnicoService,
  sendApartmentService,
} from "./services";

export const generateToken = api(
  { method: "POST", expose: true },
  async (params: GenerateTokenParams): Promise<GenerateTokenResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await generateTokenService(params);
  },
);

export const addApartment = api(
  { method: "POST", expose: true },
  async (params: AddApartmentParams): Promise<AddApartmentResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await addApartmentService(params);
  },
);

export const disableApartment = api(
  { method: "POST", expose: true },
  async (params: DisableApartmentParams): Promise<DisableApartmentResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await disableApartmentService(params);
  },
);

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

export const sendFileUnico = api(
  { method: "POST", expose: true },
  async (params: SendFileUnicoParams): Promise<SendFileUnicoResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await sendFileUnicoService(params);
  },
);

export const sendApartment = api(
  { method: "POST", expose: true },
  async (params: SendApartmentParams): Promise<SendApartmentResponse> => {
    const auth = getAuthData();
    if (!auth?.userID) {
      throw new Error("User not authenticated");
    }

    return await sendApartmentService(params);
  },
);
