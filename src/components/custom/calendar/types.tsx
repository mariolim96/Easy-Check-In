export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  nationality: string;
  documentType: "passport" | "id_card" | "driving_license" | "other";
  documentNumber: string;
  documentIssueDate: Date;
  documentExpiryDate: Date;
  documentIssuePlace: string;
  documentScanUrl?: string;
  isMainGuest: boolean;
  alloggiatiWebStatus?: "pending" | "submitted" | "error";
  alloggiatiWebReceiptUrl?: string;
}
export interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: Guest[];
  platform: "airbnb" | "booking" | "direct" | "other";
  platformId?: string;
  status: "confirmed" | "cancelled" | "completed";
  totalAmount: number;
  notes?: string;
}