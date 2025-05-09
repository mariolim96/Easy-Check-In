export interface GuestDocument {
  documentIssueDate: string;
  documentExpiryDate: string;
  documentIssuePlace: string;
  documentType: string;
  documentNumber: string;
  documentScan?: string;
  documentIssueCountry: string;
}
export interface CreateGuestParams {
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  document?: GuestDocument;
  members?: {
    firstName: string;
    lastName: string;
    gender: "M" | "F";
    dateOfBirth: string;
    placeOfBirth: string;
    citizenship: string;
    guestType: "family_member" | "group_member";
    arrivalDate: string;
    checkOut: string;
  }[];
}
export interface CreateBookingGuestParams {
  bookingId: string;
  guestId: string;
  guestType:
    | "group_leader"
    | "family_head"
    | "single_guest"
    | "family_member"
    | "group_member";
  checkIn: string;
  checkOut: string;
}
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  createdAt: string;
  updatedAt: string;
}
export interface GuestResponse {
  guest: Guest;
  document: GuestDocument;
}
export interface CreateGuestWithBookingParams {
  bookingId: string;
  guest: CreateGuestParams;
  guestType:
    | "group_leader"
    | "family_head"
    | "single_guest"
    | "family_member"
    | "group_member";
  checkIn: string;
  checkOut: string;
}

export interface GuestListItem {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  citizenship: string;
  placeOfBirth: string;
  guestType: string;
  checkIn: string;
  checkOut: string;
  property: {
    id: string;
    name: string;
    apartment: {
      id: string;
      name: string;
    };
  };
  alloggiatiStatus: "pending" | "submitted" | "error";
  bookingId: string;
  parent_id: string | null;
}

export interface guestWithDocument extends GuestListItem {
  document: {
    documentType: string;
    documentNumber: string;
    documentIssueCountry: string;
  };
  members?: GuestListItem[];
}
export interface ListGuestsResponse {
  guests: guestWithDocument[];
}
