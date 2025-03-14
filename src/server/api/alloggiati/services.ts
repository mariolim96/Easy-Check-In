import soap from "soap";
import type {
  SoapClient,
  AuthenticationTestResponse,
  ServiceResult,
} from "./types";

const WSDL_URL =
  "https://alloggiatiweb.poliziadistato.it/service/service.asmx?wsdl";

let soapClient: SoapClient | null = null;

export async function getSoapClient(): Promise<SoapClient | null> {
  if (!soapClient) {
    soapClient = await new Promise<SoapClient>((resolve, reject) => {
      soap.createClient(WSDL_URL, {}, (err: Error | null, client: soap.Client | undefined) => {
        if (err) {
          reject(new Error(err.message || 'Failed to create SOAP client'));
          return;
        }
        if (!client) {
          reject(new Error('SOAP client is undefined'));
          return;
        }
        resolve(client as unknown as SoapClient);
      });
    });
  }
  return soapClient;
}

export async function generateTokenService(params: {
  Utente: string;
  Password: string;
  WsKey: string;
}) {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  const result = await client.GenerateToken(params);

  if (result.result?.ErroreDettaglio) {
    throw new Error(result.result.ErroreDettaglio);
  }

  return {
    token: result.GenerateTokenResult.token,
    issued: result.GenerateTokenResult.issued,
    expires: result.GenerateTokenResult.expires,
  };
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

const Services = {
  generateTokenService,
  addApartmentService,
  disableApartmentService,
  testAuthenticationService,
  sendFileUnicoService,
  sendApartmentService,
};

export default Services;
