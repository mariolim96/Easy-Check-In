import { Booking } from './types';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { DayContentProps } from 'react-day-picker';
import { hasBookings, isCheckIn, isCheckOut } from './calendarUtils';

interface CalendarDayContentProps extends DayContentProps {
  selectedDate: Date | null;
  bookings: Booking[];
}

const CalendarDayContent = ({ 
  date: day, 
  selectedDate,
  bookings,
  ...props 
}: CalendarDayContentProps) => {
  const isSelected = selectedDate && isSameDay(day, selectedDate);
  const hasBooking = hasBookings(day, bookings);
  const checkIn = isCheckIn(day, bookings);
  const checkOut = isCheckOut(day, bookings);

  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center transition-colors",
        {
          "bg-primary/10": hasBooking && !isSelected,
          "rounded-l-full": checkIn,
          "rounded-r-full": checkOut,
        }
      )}
    >
      <div 
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
          {
            "bg-primary text-primary-foreground": isSelected,
            "hover:bg-secondary": !isSelected,
          }
        )}
      >
        {format(day, "d")}
      </div>
      
      {hasBooking && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="h-1 w-1 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
};

export default CalendarDayContent;