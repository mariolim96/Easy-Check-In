export interface Booking {
  id: string;
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  source: string;
  externalId: string | null;
  status: string;
  amount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingParams {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  source: string;
  externalId: string | null;
  status: string;
  amount: string;
  notes: string | null;
}

export interface UpdateBookingParams {
  bookingId: string;
  status: string;
}

export interface ListBookingsParams {
  apartmentId: string | null;
  status: string | null;
  fromDate: string | null;
  toDate: string | null;
}

export interface BookingResponse {
  booking: Booking;
}

export interface ListBookingsResponse {
  bookings: Booking[];
}

export interface BookingWithDetails {
  id: string;
  apartment_id: string; // Note: using snake_case to match DB
  apartment_name: string;
  property_name: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  source: string;
  external_id: string | null;
  status: string;
  amount: string; // Changed to string since it comes as "0.01"
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetUserBookingsResponse {
  bookings: BookingWithDetails[];
}
