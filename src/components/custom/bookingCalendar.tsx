import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Booking } from './calendar/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { getBookingForDate } from './calendar/calendarUtils';
import CalendarDayContent from './calendar/calendarDayContent';
import BookingDetails from './calendar/bookingDetails';
import CalendarLegend from './calendar/calendarLegend';

interface BookingCalendarProps {
  bookings: Booking[];
}

const BookingCalendar = ({ bookings }: BookingCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleDateSelect = (day: Date) => {
    setDate(day);
    const booking = getBookingForDate(day, bookings);
    setSelectedBooking(booking || null);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-medium">Booking Calendar</h3>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => day && handleDateSelect(day)}
              className="rounded-md border"
              components={{
                DayContent: (props) => (
                  <CalendarDayContent 
                    {...props} 
                    selectedDate={date} 
                    bookings={bookings} 
                  />
                ),
              }}
            />
            
            <CalendarLegend />
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-4">
              {selectedBooking ? format(date, "MMMM d, yyyy") : "No booking selected"}
            </h3>
            
            <BookingDetails 
              selectedBooking={selectedBooking} 
              selectedDate={date} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;