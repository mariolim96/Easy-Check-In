import { Booking } from "./types";
import { isSameDay, isWithinInterval } from "date-fns";

export const hasBookings = (day: Date, bookings: Booking[]) => {
  return bookings.some((booking) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    return isWithinInterval(day, { start: checkIn, end: checkOut });
  });
};

export const isCheckIn = (day: Date, bookings: Booking[]) => {
  return bookings.some((booking) => isSameDay(day, new Date(booking.checkIn)));
};

export const isCheckOut = (day: Date, bookings: Booking[]) => {
  return bookings.some((booking) => isSameDay(day, new Date(booking.checkOut)));
};

export const getBookingForDate = (day: Date, bookings: Booking[]) => {
  return bookings.find((booking) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    return isWithinInterval(day, { start: checkIn, end: checkOut });
  });
};
