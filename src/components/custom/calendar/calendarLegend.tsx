const CalendarLegend = () => {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <div className="flex items-center gap-1">
        <div className="h-3 w-3 rounded-full bg-primary/10" />
        <span className="text-xs text-muted-foreground">Booking</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-xs text-muted-foreground">Selected</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
