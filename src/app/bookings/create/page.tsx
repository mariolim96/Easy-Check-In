"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Encore } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookings } from "@/routes";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/custom/datePicker";
import type { bookings } from "@/lib/encore-client";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineCurrencyInput as CurrencyInput } from "@/components/ui/currency-input";

const createBookingSchema = z.object({
  checkIn: z.date(),
  checkOut: z.date(),
  guestCount: z.number().min(1, "At least one guest is required"),
  propertyId: z.string().min(1, "Property is required"),
  apartmentId: z.string().min(1, "Apartment is required"),
  totalAmount: z.string().min(1, "Total amount is required"),
  platform: z.enum(["direct", "airbnb", "booking", "other"]),
  status: z.enum(["confirmed", "cancelled", "completed"]),
  platformId: z.string().optional(),
  notes: z.string().optional(),
});

type CreateBookingForm = z.infer<typeof createBookingSchema>;

export default function CreateBookingPage() {
  const router = useRouter();
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const form = useForm<CreateBookingForm>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      checkIn: new Date(),
      checkOut: new Date(),
      guestCount: 1,
      propertyId: "",
      apartmentId: "",
      totalAmount: "",
      platform: "direct",
      status: "confirmed",
      platformId: "",
      notes: "",
    },
  });
  console.log(" CreateBookingPage ~ form:", form.getValues());

  const {
    data: availableProperties,
    refetch: refetchProperties,
    isLoading: isLoadingProperties,
  } = useQuery({
    queryKey: [
      "availableProperties",
      form.watch("checkIn"),
      form.watch("checkOut"),
      form.watch("guestCount"),
      searchSubmitted,
    ],
    queryFn: async () => {
      if (!searchSubmitted) return { properties: [] };
      return await Encore.Property.getAvailableProperties({
        dateFrom: form.watch("checkIn")?.toISOString().split("T")[0],
        dateTo: form.watch("checkOut")?.toISOString().split("T")[0],
        guestCount: form.watch("guestCount"),
      });
    },
    enabled: searchSubmitted,
  });

  const handleSearch = async () => {
    const isValid = await form.trigger(["checkIn", "checkOut", "guestCount"]);
    if (!isValid) {
      setSearchSubmitted(false);
      return;
    }

    setSearchSubmitted(true);
    try {
      await refetchProperties();
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to fetch available properties");
    }
  };

  const onSubmit = async (data: CreateBookingForm) => {
    try {
      const bookingData: bookings.CreateBookingParams = {
        apartmentId: data.apartmentId,
        checkIn: data.checkIn.toISOString().split("T")[0],
        checkOut: data.checkOut.toISOString().split("T")[0],
        guestCount: data.guestCount,
        source: data.platform,
        externalId: data.platformId ?? null,
        status: data.status,
        amount: data.totalAmount,
        notes: data.notes ?? null,
      };

      await Encore.Booking.createBooking(bookingData);
      toast.success("Booking created successfully!");
      form.reset();
      setSearchSubmitted(false);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    }
  };

  return (
    <Card className="mx-auto space-y-6 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        Create New Booking
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Search Available Apartments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="button" onClick={handleSearch}>
                Search
              </Button>
            </CardContent>
          </Card>

          {/* Only show the rest of the form if search is submitted */}
          {searchSubmitted && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoadingProperties ? (
                <>
                  <div>
                    <FormLabel>Property</FormLabel>
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <FormLabel>Apartment</FormLabel>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("apartmentId", "");
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableProperties?.properties.length === 0 ? (
                              <SelectItem value="no-properties" disabled>
                                No properties available for these dates
                              </SelectItem>
                            ) : (
                              availableProperties?.properties.map(
                                (property) => (
                                  <SelectItem
                                    key={property.id}
                                    value={property.id}
                                  >
                                    {property.name}
                                  </SelectItem>
                                ),
                              )
                            )}
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an apartment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!form.watch("propertyId") ? (
                              <SelectItem value="select-property" disabled>
                                Select a property first
                              </SelectItem>
                            ) : (
                              availableProperties?.properties
                                .find((p) => p.id === form.watch("propertyId"))
                                ?.apartments.map((apartment) => (
                                  <SelectItem
                                    key={apartment.id}
                                    value={apartment.id}
                                  >
                                    {apartment.name} (Max guests:{" "}
                                    {apartment.maxGuests})
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field: _ }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            onBlur={(e) => {
                              form.setValue("totalAmount", e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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

                  {form.watch("platform") !== "direct" && (
                    <FormField
                      control={form.control}
                      name="platformId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform ID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add any additional notes here"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-1 flex flex-col gap-2 md:col-span-2 md:flex-row md:justify-end md:space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full md:w-auto"
                      onClick={() => router.push(Bookings())}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="w-full md:w-auto">
                      Create Booking
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
