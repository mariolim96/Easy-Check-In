import soap from "soap";
import type {
  SoapClient,
  GenerateTokenParams,
  GenerateTokenResult,
  ServiceResult,
  AuthenticationTestResponse,
  TabellaParams,
  TabellaResponse,
} from "./types";

const WSDL_URL =
  "https://alloggiatiweb.poliziadistato.it/service/service.asmx?wsdl";

let soapClient: SoapClient | null = null;

export async function getSoapClient(): Promise<SoapClient> {
  if (!soapClient) {
    try {
      soapClient = (await soap.createClientAsync(
        WSDL_URL,
      )) as unknown as SoapClient;
    } catch (error: any) {
      throw new Error(`Failed to create SOAP client: ${error.message}`);
    }
  }
  return soapClient;
}

export async function generateTokenService(params: GenerateTokenParams) {
  const client = await getSoapClient();

  try {
    const [result] = await client.GenerateTokenAsync(params);

    if (result.result?.ErroreDettaglio) {
      throw new Error(result.result.ErroreDettaglio);
    }

    return {
      token: result.GenerateTokenResult.token,
      issued: result.GenerateTokenResult.issued,
      expires: result.GenerateTokenResult.expires,
    };
  } catch (error: any) {
    throw new Error(`Generate token failed: ${error.message}`);
  }
}

export async function addApartmentService(params: {
  Utente: string;
  token: string;
  Descrizione: string;
  ComuneCodice: string;
  Indirizzo: string;
  Proprietario: string;
}) {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  const result = await client.GestioneAppartamenti_AggiungiAppartamento(params);

  return {
    success:
      !result.GestioneAppartamenti_AggiungiAppartamentoResult.ErroreDettaglio,
    error:
      result.GestioneAppartamenti_AggiungiAppartamentoResult.ErroreDettaglio ||
      undefined,
  };
}

export async function disableApartmentService(params: {
  Utente: string;
  token: string;
  IdAppartamento: number;
}) {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  const result =
    await client.GestioneAppartamenti_DisabilitaAppartamento(params);

  return {
    success:
      !result.GestioneAppartamenti_DisabilitaAppartamentoResult.ErroreDettaglio,
    error:
      result.GestioneAppartamenti_DisabilitaAppartamentoResult
        .ErroreDettaglio || undefined,
  };
}

export async function testAuthenticationService(params: {
  Utente: string;
  token: string;
}): Promise<AuthenticationTestResponse> {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  const result = await client.Authentication_Test(params);
  const response = result as { Authentication_TestResult: ServiceResult };

  return {
    ErroreDettaglio: response.Authentication_TestResult.ErroreDettaglio,
  };
}

export async function sendFileUnicoService(params: {
  Utente: string;
  token: string;
  ElencoSchedine: string[];
}) {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  const result = await client.GestioneAppartamenti_FileUnico_Send(params);

  if (result.GestioneAppartamenti_FileUnico_SendResult.ErroreDettaglio) {
    return {
      schedineValide: 0,
      errors: [
        result.GestioneAppartamenti_FileUnico_SendResult.ErroreDettaglio,
      ],
      success: false,
    };
  }

  const detailedErrors = result.result.Dettaglio.EsitoOperazioneServizio.map(
    (esito) => esito.ErroreDettaglio,
  ).filter((error) => error !== null && error !== "");

  return {
    schedineValide: result.result.SchedineValide,
    errors: detailedErrors,
    success: detailedErrors.length === 0,
  };
}

export async function sendApartmentService(params: {
  Utente: string;
  token: string;
  ElencoSchedine: string[];
  IdAppartamento: number;
}) {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  const result = await client.GestioneAppartamenti_Send(params);

  if (result.GestioneAppartamenti_SendResult.ErroreDettaglio) {
    return {
      schedineValide: 0,
      errors: [result.GestioneAppartamenti_SendResult.ErroreDettaglio],
      success: false,
    };
  }

  const detailedErrors = result.result.Dettaglio.EsitoOperazioneServizio.map(
    (esito) => esito.ErroreDettaglio,
  ).filter((error) => error !== null && error !== "");

  return {
    schedineValide: result.result.SchedineValide,
    errors: detailedErrors,
    success: detailedErrors.length === 0,
  };
}

export async function tabellaService(
  params: TabellaParams,
): Promise<TabellaResponse> {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  const result = await client.Tabella(params);

  return {
    csv: result.TabellaResult.CSV,
    error: result.TabellaResult.ErroreDettaglio || undefined,
  };
}

const Services = {
  generateTokenService,
  addApartmentService,
  disableApartmentService,
  testAuthenticationService,
  sendFileUnicoService,
  sendApartmentService,
  tabellaService,
};

export default Services;
