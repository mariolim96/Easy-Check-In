import soap from "soap";
import type {
  SoapClient,
  GenerateTokenParams,
  GenerateTokenResult,
  ServiceResult,
  AuthenticationTestResponse,
  TabellaParams,
  TabellaResponse,
  Apartment,
  SendParams,
  SendResponse,
  TestParams,
  TestResponse,
} from "./types";
import log from "encore.dev/log";

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

export async function tabellaService(
  params: TabellaParams,
): Promise<TabellaResponse> {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  try {
    // Create the SOAP request parameters
    const soapParams = {
      Utente: params.Utente,
      token: params.token,
      tipo: params.tipo,
      CSV: "", // This is required by the SOAP interface but can be empty
    };

    // Wrap the SOAP call in a Promise
    const [result] = await client.TabellaAsync(soapParams);

    // Check if result exists and has expected structure
    if (!result?.TabellaResult) {
      return {
        data: [],
        error: "Invalid response from SOAP service" + JSON.stringify(result),
      };
    }

    // Check for errors in the TabellaResult
    if (result.TabellaResult.ErroreDettaglio) {
      return {
        data: [],
        error: result.TabellaResult.ErroreDettaglio + JSON.stringify(result),
      };
    }

    // Check if CSV exists
    if (!result.CSV) {
      return {
        data: [],
        error: "No data received from service" + JSON.stringify(result),
      };
    }

    const csvRows = result.CSV.split("\n");
    const headers = [
      "IDAPP",
      "Descrizione",
      "COMUNE",
      "PROV",
      "Indirizzo",
      "Proprietario",
    ];

    const data = csvRows
      .slice(1)
      .filter((row: string) => row.trim() !== "")
      .map((row: string) => {
        const values = row.split(";");
        return headers.reduce((obj, header, index) => {
          obj[header as keyof Apartment] = values[index]?.trim() || "";
          return obj;
        }, {} as Apartment);
      });

    return {
      data,
      error: undefined,
    };
  } catch (error) {
    console.error("Tabella service error:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
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

  try {
    const [result] = await client.Authentication_TestAsync(params);

    // Check if there's an error in the response
    if (result.Authentication_TestResult?.ErroreDettaglio) {
      return {
        ErroreDettaglio: result.Authentication_TestResult.ErroreDettaglio,
        success: false,
      };
    }

    // If no error, authentication was successful
    return {
      ErroreDettaglio: "",
      success: true,
    };
  } catch (error) {
    console.error("Authentication test error:", error);
    return {
      success: false,
      ErroreDettaglio:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// export async function sendFileUnicoService(params: {
//   Utente: string;
//   token: string;
//   ElencoSchedine: string[];
// }) {
//   const client = await getSoapClient();
//   if (!client) {
//     throw new Error("Failed to create SOAP client");
//   }

//   const result = await client.GestioneAppartamenti_FileUnico_Send(params);

//   if (result.GestioneAppartamenti_FileUnico_SendResult.ErroreDettaglio) {
//     return {
//       schedineValide: 0,
//       errors: [
//         result.GestioneAppartamenti_FileUnico_SendResult.ErroreDettaglio,
//       ],
//       success: false,
//     };
//   }

//   const detailedErrors = result.result.Dettaglio.EsitoOperazioneServizio.map(
//     (esito) => esito.ErroreDettaglio,
//   ).filter((error) => error !== null && error !== "");

//   return {
//     schedineValide: result.result.SchedineValide,
//     errors: detailedErrors,
//     success: detailedErrors.length === 0,
//   };
// }

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

export async function sendService(params: SendParams): Promise<SendResponse> {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  try {
    // Ensure ElencoSchedine is properly formatted as a string with line breaks
    // The SOAP service expects a single string with records separated by line breaks
    const formattedElencoSchedine = Array.isArray(params.ElencoSchedine)
      ? params.ElencoSchedine.join("")
      : params.ElencoSchedine;

    log.debug("production service response", {
      formattedElencoSchedine,
      //   ...params,
    });
    // Create a new params object with the formatted ElencoSchedine
    const formattedParams = {
      ...params,
      ElencoSchedine: formattedElencoSchedine,
    };

    const [result] = await client.SendAsync(formattedParams);

    if (result.SendResult?.ErroreDettaglio) {
      return {
        schedineValide: 0,
        errors: [result.SendResult.ErroreDettaglio],
        success: false,
      };
    }

    // Check if result.result exists before accessing its properties
    if (!result.result) {
      return {
        schedineValide: 0,
        errors: ["Invalid response from service: missing result data"],
        success: false,
      };
    }

    const detailedErrors =
      result.result.Dettaglio?.EsitoOperazioneServizio?.map(
        (esito) => esito.ErroreDettaglio,
      ).filter((error) => error !== null && error !== "") || [];

    return {
      schedineValide: result.result.SchedineValide || 0,
      errors: detailedErrors,
      success: detailedErrors.length === 0,
    };
  } catch (error) {
    console.error("Send service error:", error);
    return {
      schedineValide: 0,
      errors: [
        error instanceof Error ? error.message : "An unknown error occurred",
      ],
      success: false,
    };
  }
}

export async function testService(params: TestParams): Promise<TestResponse> {
  const client = await getSoapClient();
  if (!client) {
    throw new Error("Failed to create SOAP client");
  }

  try {
    // Ensure ElencoSchedine is properly formatted as a string with line breaks
    // The SOAP service expects a single string with records separated by line breaks
    const formattedElencoSchedine = Array.isArray(params.ElencoSchedine)
      ? params.ElencoSchedine.join("\r\n")
      : params.ElencoSchedine;

    // Create a new params object with the formatted ElencoSchedine
    const formattedParams = {
      ...params,
      ElencoSchedine: formattedElencoSchedine,
    };
    log.debug("production service response", {
      formattedElencoSchedine,
      ...params,
    });
    const [result] = await client.TestAsync(formattedParams);

    if (result.TestResult?.ErroreDettaglio) {
      return {
        schedineValide: 0,
        errors: [result.TestResult.ErroreDettaglio],
        success: false,
      };
    }

    // Check if result.result exists before accessing its properties
    if (!result.result) {
      return {
        schedineValide: 0,
        errors: ["Invalid response from service: missing result data"],
        success: false,
      };
    }

    const detailedErrors =
      result.result.Dettaglio?.EsitoOperazioneServizio?.map(
        (esito: { ErroreDettaglio: any }) => esito.ErroreDettaglio,
      ).filter((error: string | null) => error !== null && error !== "") || [];

    return {
      schedineValide: result.result.SchedineValide || 0,
      errors: detailedErrors,
      success: detailedErrors.length === 0,
    };
  } catch (error) {
    console.error("Test service error:", error);
    return {
      schedineValide: 0,
      errors: [
        error instanceof Error ? error.message : "An unknown error occurred",
      ],
      success: false,
    };
  }
}

const Services = {
  generateTokenService,
  addApartmentService,
  disableApartmentService,
  testAuthenticationService,
  //   sendFileUnicoService,
  sendApartmentService,
  tabellaService,
  sendService,
  testService,
};

export default Services;
