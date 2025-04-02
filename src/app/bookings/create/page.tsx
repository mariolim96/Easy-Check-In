"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookings } from "@/routes";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/custom/datePicker";
import type { bookings } from "@/lib/encore-client";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingFormData {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guestCount: number;
  propertyId: string;
  apartmentId: string;
  platform: "airbnb" | "booking" | "direct" | "other";
  platformId?: string;
  totalAmount: number;
  status: "confirmed" | "cancelled" | "completed";
  notes?: string;
}

export default function CreateBookingPage() {
  const router = useRouter();
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingFormData, string>>
  >({});

  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: undefined,
    checkOut: undefined,
    guestCount: 1,
    propertyId: "",
    apartmentId: "",
    platform: "direct",
    totalAmount: 0,
    status: "confirmed",
  });

  const {
    data: availableProperties,
    refetch: refetchProperties,
    isLoading: isLoadingProperties,
  } = useQuery({
    queryKey: [
      "availableProperties",
      formData.checkIn,
      formData.checkOut,
      formData.guestCount,
      searchSubmitted,
    ],
    queryFn: async () => {
      if (!searchSubmitted) return { properties: [] };
      return await Encore.Property.getAvailableProperties({
        dateFrom: formData.checkIn?.toISOString().split("T")[0],
        dateTo: formData.checkOut?.toISOString().split("T")[0],
        guestCount: formData.guestCount,
      });
    },
    enabled: searchSubmitted,
  });

  const validateSearch = () => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.checkIn) newErrors.checkIn = "Check-in date is required";
    if (!formData.checkOut) newErrors.checkOut = "Check-out date is required";
    if (formData.guestCount < 1)
      newErrors.guestCount = "At least one guest is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = useCallback(async () => {
    if (!validateSearch()) {
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
  }, [refetchProperties, validateSearch]);

  // Add this effect to automatically search when all required fields are filled
  useEffect(() => {
    const canSearch =
      formData.checkIn && formData.checkOut && formData.guestCount >= 1;
    if (canSearch) {
      void handleSearch();
    }
  }, [formData.checkIn, formData.checkOut, formData.guestCount, handleSearch]);

  const handleInputChange = (field: keyof BookingFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.checkIn) newErrors.checkIn = "Check-in date is required";
    if (!formData.checkOut) newErrors.checkOut = "Check-out date is required";
    if (formData.guestCount < 1)
      newErrors.guestCount = "At least one guest is required";
    if (!formData.propertyId) newErrors.propertyId = "Property is required";
    if (!formData.apartmentId) newErrors.apartmentId = "Apartment is required";
    if (formData.totalAmount <= 0)
      newErrors.totalAmount = "Amount must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("Submitting booking", formData);

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Format dates properly by removing time component
      const checkInDate = formData.checkIn?.toISOString().split("T")[0] ?? "";
      const checkOutDate = formData.checkOut?.toISOString().split("T")[0] ?? "";

      const bookingData: bookings.CreateBookingParams = {
        apartmentId: formData.apartmentId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestCount: formData.guestCount,
        source: formData.platform,
        externalId: formData.platformId ?? null,
        status: formData.status,
        amount: formData.totalAmount,
        notes: formData.notes ?? null,
      };

      console.log("Sending booking data:", bookingData);
      await Encore.Booking.createBooking(bookingData);
      toast.success("Booking created successfully!");

      // Reset form
      setFormData({
        checkIn: undefined,
        checkOut: undefined,
        guestCount: 1,
        propertyId: "",
        apartmentId: "",
        platform: "direct",
        totalAmount: 0,
        status: "confirmed",
      });
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

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Available Apartments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Check-in Date
              </label>
              <DatePicker
                value={formData.checkIn}
                onChange={(date) => handleInputChange("checkIn", date)}
              />
              {errors.checkIn && (
                <p className="text-sm text-red-500">{errors.checkIn}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Check-out Date
              </label>
              <DatePicker
                value={formData.checkOut}
                onChange={(date) => handleInputChange("checkOut", date)}
              />
              {errors.checkOut && (
                <p className="text-sm text-red-500">{errors.checkOut}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Number of Guests
              </label>
              <Input
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={(e) =>
                  handleInputChange("guestCount", parseInt(e.target.value))
                }
              />
              {errors.guestCount && (
                <p className="text-sm text-red-500">{errors.guestCount}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Only show the rest of the form if search is submitted */}
      {searchSubmitted && (
        <>
          {/* Property Selection */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {isLoadingProperties ? (
              // Loading state with skeletons
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Property
                  </label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Apartment
                  </label>
                  <Skeleton className="h-10 w-full" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Property
                  </label>
                  <Select
                    value={formData.propertyId}
                    onValueChange={(value) => {
                      handleInputChange("propertyId", value);
                      handleInputChange("apartmentId", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProperties?.properties.length === 0 ? (
                        <SelectItem value="no-properties" disabled>
                          No properties available for these dates
                        </SelectItem>
                      ) : (
                        availableProperties?.properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.propertyId && (
                    <p className="text-sm text-red-500">{errors.propertyId}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Apartment
                  </label>
                  <Select
                    value={formData.apartmentId}
                    onValueChange={(value) =>
                      handleInputChange("apartmentId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an apartment" />
                    </SelectTrigger>
                    <SelectContent>
                      {!formData.propertyId ? (
                        <SelectItem value="select-property" disabled>
                          Select a property first
                        </SelectItem>
                      ) : (
                        availableProperties?.properties
                          .find((p) => p.id === formData.propertyId)
                          ?.apartments.map((apartment) => (
                            <SelectItem key={apartment.id} value={apartment.id}>
                              {apartment.name} (Max guests:{" "}
                              {apartment.maxGuests})
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.apartmentId && (
                    <p className="text-sm text-red-500">{errors.apartmentId}</p>
                  )}
                </div>

                {/* Booking Details */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Total Amount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={(e) =>
                      handleInputChange(
                        "totalAmount",
                        parseFloat(e.target.value),
                      )
                    }
                  />
                  {errors.totalAmount && (
                    <p className="text-sm text-red-500">{errors.totalAmount}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Platform
                  </label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      handleInputChange("platform", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="booking">Booking.com</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.platform !== "direct" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Platform ID
                    </label>
                    <Input
                      value={formData.platformId}
                      onChange={(e) =>
                        handleInputChange("platformId", e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="col-span-1 md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add any additional notes here"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="col-span-1 flex flex-col gap-2 md:col-span-2 md:flex-row md:justify-end md:space-x-4">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto"
                    onClick={() => router.push(Bookings())}
                  >
                    Cancel
                  </Button>
                  <Button className="w-full md:w-auto" onClick={handleSubmit}>
                    Create Booking
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
