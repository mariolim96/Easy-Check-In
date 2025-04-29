import type { Client } from "soap";
import { GuestListItem, guestWithDocument } from "../guests/types";

export interface SoapClient extends Client {
  GenerateToken(params: GenerateTokenParams): Promise<{
    GenerateTokenResult: GenerateTokenResult;
    result: ServiceResult;
  }>;
  Authentication_TestAsync(params: AuthenticationTestParams): Promise<
    [
      {
        Authentication_TestResult: {
          ErroreDettaglio: string;
        };
      },
    ]
  >;
  GestioneAppartamenti_AggiungiAppartamento(
    params: AddApartmentParams,
  ): Promise<{
    GestioneAppartamenti_AggiungiAppartamentoResult: AddApartmentResult;
  }>;
  GestioneAppartamenti_DisabilitaAppartamento(
    params: DisableApartmentParams,
  ): Promise<{
    GestioneAppartamenti_DisabilitaAppartamentoResult: DisableApartmentResult;
  }>;
  //   GestioneAppartamenti_FileUnico_Send(params: SendFileUnicoParams): Promise<{
  //     GestioneAppartamenti_FileUnico_SendResult: { ErroreDettaglio: string };
  //     result: SendFileUnicoResult;
  //   }>;
  GestioneAppartamenti_Send(params: SendApartmentParams): Promise<{
    GestioneAppartamenti_SendResult: { ErroreDettaglio: string };
    result: SendFileUnicoResult;
  }>;
  Tabella(params: TabellaParams): Promise<{
    TabellaResult: TabellaResult;
  }>;
  SendAsync(params: SendParams): Promise<
    [
      {
        SendResult: {
          ErroreDettaglio: string;
        };
        result: SendResult;
      },
    ]
  >;
}
export interface GenerateTokenParams {
  Utente: string;
  Password: string;
  WsKey: string;
}
export interface GenerateTokenResult {
  issued: string;
  expires: string;
  token: string;
}
export interface ServiceResult {
  ErroreDettaglio: string;
}
export interface GenerateTokenResponse {
  token: string;
  issued: string;
  expires: string;
  error?: string;
}
export interface AddApartmentParams {
  Utente: string;
  token: string;
  Descrizione: string;
  ComuneCodice: string;
  Indirizzo: string;
  Proprietario: string;
}
export interface AddApartmentResult {
  ErroreDettaglio: string;
}
export interface AddApartmentResponse {
  success: boolean;
  error?: string;
}
export interface DisableApartmentParams {
  Utente: string;
  token: string;
  IdAppartamento: number;
}
export interface DisableApartmentResult {
  ErroreDettaglio: string;
}
export interface DisableApartmentResponse {
  success: boolean;
  error?: string;
}
export interface AuthenticationTestParams {
  Utente: string;
  token: string;
}
export interface AuthenticationTestResponse {
  ErroreDettaglio: string;
  success?: boolean;
}
export interface EsitoOperazioneServizio {
  ErroreDettaglio: string;
}
export interface SendFileUnicoResult {
  SchedineValide: number;
  Dettaglio: { EsitoOperazioneServizio: EsitoOperazioneServizio[] };
}
export interface SendFileUnicoParams {
  //   Utente: string;
  //   token: string;
  ElencoSchedine: guestWithDocument;
}
export interface SendFileUnicoResponse {
  schedineValide: number;
  errors: string[];
  success: boolean;
}
export interface SendApartmentParams {
  Utente: string;
  token: string;
  ElencoSchedine: string[];
  IdAppartamento: number;
}
export interface SendApartmentResponse {
  schedineValide: number;
  errors: string[];
  success: boolean;
}
export type TabellaType =
  | "Luoghi"
  | "Tipi_Documento"
  | "Tipi_Alloggiato"
  | "TipoErrore"
  | "ListaAppartamenti";

export interface TabellaParams {
  Utente: string;
  token: string;
  tipo: TabellaType;
}

export interface TabellaResult {
  esito: boolean;
  ErroreCod: string;
  ErroreDes: string;
  ErroreDettaglio: string;
  CSV: string;
}

export interface Apartment {
  IDAPP: string;
  Descrizione: string;
  COMUNE: string;
  PROV: string;
  Indirizzo: string;
  Proprietario: string;
}

export interface TabellaResponse {
  data: Apartment[];
  error?: string;
}

export interface SendParams {
  Utente: string;
  token: string;
  ElencoSchedine: string[] | string;
}

export interface SendResult {
  SchedineValide: number;
  Dettaglio: {
    EsitoOperazioneServizio: EsitoOperazioneServizio[];
  };
}

export interface SendResponse {
  schedineValide: number;
  errors: string[];
  success: boolean;
}

export interface TestParams {
  Utente: string;
  token: string;
  ElencoSchedine: string[] | string;
}

export interface TestResult {
  ErroreDettaglio: string;
  result?: {
    SchedineValide: number;
    Dettaglio: {
      EsitoOperazioneServizio: EsitoOperazioneServizio[];
    };
  };
}

export interface TestResponse {
  schedineValide: number;
  errors: string[];
  success: boolean;
}
