export interface AlloggiatiConfig {
  username: string;
  password: string;
  wsKey: string;
}

export interface ApartmentInput {
  name: string;
  maxGuests: number;
}

export interface ApartmentOutput {
  id: string;
  name: string;
  maxGuests: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  has_sciaa_license: boolean;
  apartments: ApartmentOutput[];
}

export interface CreatePropertyParams {
  name: string;
  address: string;
  hasSciaaLicense: boolean;
  alloggiatiConfig: AlloggiatiConfig;
  apartments: ApartmentInput[];
}

export interface CreatePropertyResponse {
  id: string;
  apartments: Pick<ApartmentOutput, "id" | "name">[];
}

export interface GetPropertyParams {
  propertyId: string;
}

export interface GetPropertyResponse {
  property: Property;
}

export interface GetAvailablePropertiesParams {
  dateFrom?: string;
  dateTo?: string;
  guestCount?: number;
}

export interface AvailableApartment {
  id: string;
  name: string;
  maxGuests: number;
}

export interface AvailableProperty {
  id: string;
  name: string;
  apartments: AvailableApartment[];
}

export interface GetAvailablePropertiesResponse {
  properties: AvailableProperty[];
}

