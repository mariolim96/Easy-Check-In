export interface Member {
  stayLength: number;
  citizenship: string;
  placeOfBirth: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F";
  guestType: "family_member" | "group_member";
}

export interface Guest {
  id: string;
  guestType: "single_guest" | "family_head" | "group_leader" | "family_member" | "group_member";
  arrivalDate: string;
  stayLength: number;
  citizenship: string;
  placeOfBirth: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F";
  documentIssuePlace: string;
  documentType: string;
  documentNumber: string;
  members?: Member[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGuestParams {
  guestType: Guest["guestType"];
  arrivalDate: string;
  stayLength: number;
  citizenship: string;
  placeOfBirth: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F";
  documentIssuePlace: string;
  documentType: string;
  documentNumber: string;
  members?: Member[];
}

export interface CreateGuestResponse {
  guest: Guest;
}