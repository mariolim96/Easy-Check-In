export interface Booking {
  id: string;
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  source: string;
  externalId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingParams {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  source: string;
  externalId?: string;
  status: string;
}

export interface UpdateBookingParams {
  bookingId: string;
  status: string;
}

export interface ListBookingsParams {
  apartmentId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface BookingResponse {
  booking: Booking;
}

export interface ListBookingsResponse {
  bookings: Booking[];
}
