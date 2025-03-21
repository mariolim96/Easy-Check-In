"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Encore } from "@/lib/encore-client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookings } from "@/routes";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/custom/datePicker";

// Modify the form schema to split it into search and booking parts
const searchSchema = z.object({
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  guestCount: z.coerce
    .number({
      required_error: "Number of guests is required",
    })
    .min(1, "At least one guest is required"),
});

const formSchema = searchSchema.extend({
  propertyId: z.string({
    required_error: "Please select a property",
  }),
  apartmentId: z.string({
    required_error: "Please select an apartment",
  }),
  platform: z.enum(["airbnb", "booking", "direct", "other"], {
    required_error: "Please select a platform",
  }),
  platformId: z.string().optional(),
  totalAmount: z.coerce
    .number({
      required_error: "Total amount is required",
    })
    .min(0, "Amount cannot be negative"),
  status: z.enum(["confirmed", "cancelled", "completed"], {
    required_error: "Please select a status",
  }),
  notes: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateBookingPage() {
  const router = useRouter();
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "confirmed",
      platform: "direct",
      guestCount: 1,
    },
  });

  const { checkIn, checkOut, guestCount } = form.watch();

  const { data: availableProperties, refetch: refetchProperties } = useQuery({
    queryKey: ["availableProperties", checkIn, checkOut, guestCount],
    queryFn: async () => {
      if (!searchSubmitted) return { properties: [] };
      return await Encore.Property.getAvailableProperties({
        dateFrom: checkIn?.toISOString(),
        dateTo: checkOut?.toISOString(),
        guestCount,
      });
    },
    enabled: searchSubmitted,
  });

  const handleSearch = async () => {
    const searchResult = await form.trigger(["checkIn", "checkOut", "guestCount"]);
    if (!searchResult) return;
    
    setSearchSubmitted(true);
    await refetchProperties();
  };

  const handlePropertyChange = (value: string) => {
    setSelectedPropertyId(value);
    form.setValue("propertyId", value);
    form.setValue("apartmentId", "");
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      // Here you would call your API to create the booking
      // await Encore.Booking.createBooking(values);

      toast.success("Booking created successfully!");
      router.push(Bookings());
      router.refresh();
    } catch (error) {
      toast.error("Failed to create booking");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="container mx-auto p-6 bg-white">
        <h1 className="mb-6 text-3xl font-bold">Create New Booking</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Search Available Apartments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-out Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Enter number of guests"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" onClick={handleSearch}>
                  Search Available Apartments
                </Button>
              </CardContent>
            </Card>

            {/* Property and Apartment Selection */}
            {searchSubmitted && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select onValueChange={handlePropertyChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableProperties?.properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apartmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an apartment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableProperties?.properties
                            .find((p) => p.id === selectedPropertyId)
                            ?.apartments.map((apartment) => (
                              <SelectItem key={apartment.id} value={apartment.id}>
                                {apartment.name} (Max guests: {apartment.maxGuests})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Guest Count and Amount */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Enter number of guests"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter total amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Platform and Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="direct">Direct</SelectItem>
                        <SelectItem value="airbnb">Airbnb</SelectItem>
                        <SelectItem value="booking">Booking.com</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(Bookings())}
              >
                Cancel
              </Button>
              <Button type="submit">Create Booking</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}




