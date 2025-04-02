"use client";

import { useState, Suspense } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Encore } from "@/lib/utils";
import { DateInputPicker } from "@/components/ui/date-input-picker";
import { SelectSearch } from "@/components/ui/select-search";
import { STATI } from "@/constants/stati";
import { COMUNI } from "@/constants/comuni";

// Transform STATI and COMUNI for SelectSearch options
const countryOptions = STATI.map((stato) => ({
  value: stato.Codice.toString(),
  label: stato.Descrizione,
}));

const comuneOptions = COMUNI.map((comune) => ({
  value: comune.Codice.toString(),
  label: comune.Descrizione,
}));

// Combine both options with a separator
const documentIssuePlaceOptions = comuneOptions.concat(countryOptions);

const memberSchema = z.object({
  arrivalDate: z.date({
    required_error: "Arrival date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  citizenship: z.string().min(1, "Citizenship is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["M", "F"]),
  guestType: z.enum(["family_member", "group_member"]),
});

const guestSchema = z.object({
  guestType: z.enum([
    "single_guest",
    "family_head",
    "group_leader",
    "family_member",
    "group_member",
  ]),
  arrivalDate: z.date({
    required_error: "Arrival date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  citizenship: z.string().min(1, "Citizenship is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["M", "F"]),
  documentIssuePlace: z.string().min(1, "Document issue place is required"),
  documentType: z.enum(
    [
      "passport", // Passaporto
      "id_card", // Carta d'identità
      "residence_permit", // Permesso di soggiorno
      "driving_license", // Patente di guida (only for Italian citizens)
      "firearms_license", // Porto d'armi (only for Italian citizens)
      "nautical_license", // Patente nautica (only for Italian citizens)
      "diplomatic_id", // Tessera diplomatica
    ],
    {
      required_error: "Document type is required",
    },
  ),
  documentNumber: z.string().min(1, "Document number is required"),
  members: z.array(memberSchema).optional(),
});

type CreateGuestForm = z.infer<typeof guestSchema>;

function CreateGuestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  // Get booking dates from URL params
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const bookingId = searchParams.get("bookingId");

  // Validate that we have the required booking information

  const form = useForm<CreateGuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guestType: "single_guest",
      arrivalDate: checkIn ? new Date(checkIn) : new Date(),
      checkOut: checkOut ? new Date(checkOut) : new Date(),
      gender: "M",
      members: [],
      documentType: "passport", // Add this default value
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  if (!checkIn || !checkOut || !bookingId) {
    toast.error("Missing booking information");
    router.back();
    return null;
  }

  const watchGuestType = form.watch("guestType");
  const isGroupOrFamily =
    watchGuestType === "family_head" || watchGuestType === "group_leader";

  const addMember = () => {
    append({
      arrivalDate: checkIn ? new Date(checkIn) : new Date(),
      checkOut: checkOut ? new Date(checkOut) : new Date(),
      citizenship: "",
      placeOfBirth: "",
      firstName: "",
      lastName: "",
      dateOfBirth: new Date(),
      gender: "M",
      guestType:
        watchGuestType === "family_head" ? "family_member" : "group_member",
    });
  };

  const onSubmit = async (values: CreateGuestForm) => {
    try {
      setIsPending(true);

      const response = await Encore.guests.createGuestWithBooking({
        bookingId,
        guest: {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth.toISOString().split("T")[0],
          placeOfBirth: values.placeOfBirth,
          nationality: values.citizenship,
          document: {
            documentType: values.documentType,
            documentNumber: values.documentNumber,
            documentIssuePlace: values.documentIssuePlace,
            documentIssueDate: new Date().toISOString().split("T")[0], // Add this field to your form if needed
            documentExpiryDate: new Date().toISOString().split("T")[0], // Add this field to your form if needed
            documentIssueCountry: values.citizenship, // You might want to add a separate field for this
          },
          members: values.members?.map((member) => ({
            firstName: member.firstName,
            lastName: member.lastName,
            gender: member.gender,
            dateOfBirth: member.dateOfBirth.toISOString().split("T")[0],
            placeOfBirth: member.placeOfBirth,
            citizenship: member.citizenship,
            guestType: member.guestType,
            arrivalDate: member.arrivalDate.toISOString().split("T")[0],
            checkOut: member.checkOut.toISOString().split("T")[0],
          })),
        },
        guestType: values.guestType,
        checkIn: values.arrivalDate.toISOString().split("T")[0],
        checkOut: values.checkOut.toISOString().split("T")[0],
      });

      console.log("Submitting guest", values);
      toast.success("Guest created successfully");
      router.back();
    } catch (error) {
      toast.error("Failed to create guest");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  // Add this handler for text inputs
  const handleUppercaseInput = (
    field: any,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const upperValue = event.target.value.toUpperCase();
    field.onChange(upperValue);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Guest</CardTitle>
          <p className="text-sm text-muted-foreground">
            Booking period: {format(new Date(checkIn), "MMM d, yyyy")} -{" "}
            {format(new Date(checkOut), "MMM d, yyyy")}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="arrivalDate"
                  render={({ field }) => (
                    <DateInputPicker
                      label="Arrival Date"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date)}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      error={form.formState.errors.arrivalDate?.message}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleUppercaseInput(field, e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleUppercaseInput(field, e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select guest type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single_guest">
                            Ospite Singolo
                          </SelectItem>
                          <SelectItem value="family_head">
                            Capo Famiglia
                          </SelectItem>
                          <SelectItem value="group_leader">
                            Capo Gruppo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <DateInputPicker
                      label="Check-out Date"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date)}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      error={form.formState.errors.checkOut?.message}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="citizenship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizenship</FormLabel>
                      <FormControl>
                        <SelectSearch
                          options={countryOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select citizenship"
                          searchPlaceholder="Search countries..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Birth</FormLabel>
                      <FormControl>
                        <SelectSearch
                          options={countryOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select place of birth"
                          searchPlaceholder="Search countries..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <DateInputPicker
                      label="Date of Birth"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date)}
                      error={form.formState.errors.dateOfBirth?.message}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentIssuePlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Issue Place</FormLabel>
                      <FormControl>
                        <SelectSearch
                          options={documentIssuePlaceOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select document issue place"
                          searchPlaceholder="Search places..."
                          emptyMessage="No places found"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passport">Passaporto</SelectItem>
                          <SelectItem value="id_card">
                            Carta d&apos;identità
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleUppercaseInput(field, e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isGroupOrFamily && (
                <div className="col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {watchGuestType === "family_head"
                        ? "Family Members"
                        : "Group Members"}
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMember}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="pt-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="font-medium">Member {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {/* Add arrival date field for each member */}
                          <FormField
                            control={form.control}
                            name={`members.${index}.arrivalDate`}
                            render={({ field }) => (
                              <DateInputPicker
                                label="Arrival Date"
                                value={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onChange={(date) => field.onChange(date)}
                                checkIn={checkIn}
                                checkOut={checkOut}
                                error={
                                  form.formState.errors.members?.[index]
                                    ?.arrivalDate?.message
                                }
                              />
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    onChange={(e) =>
                                      handleUppercaseInput(field, e)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    onChange={(e) =>
                                      handleUppercaseInput(field, e)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.gender`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.dateOfBirth`}
                            render={({ field }) => (
                              <DateInputPicker
                                label="Date of Birth"
                                value={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    date?.toISOString().split("T")[0],
                                  )
                                }
                                error={
                                  form.formState.errors.members?.[index]
                                    ?.dateOfBirth?.message
                                }
                              />
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.placeOfBirth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Place of Birth</FormLabel>
                                <FormControl>
                                  <SelectSearch
                                    options={countryOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select place of birth"
                                    searchPlaceholder="Search countries..."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.citizenship`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Citizenship</FormLabel>
                                <FormControl>
                                  <SelectSearch
                                    options={countryOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select citizenship"
                                    searchPlaceholder="Search countries..."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.checkOut`}
                            render={({ field }) => (
                              <DateInputPicker
                                label="Check-out Date"
                                value={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onChange={(date) => field.onChange(date)}
                                checkIn={checkIn}
                                checkOut={checkOut}
                                error={
                                  form.formState.errors.members?.[index]
                                    ?.checkOut?.message
                                }
                              />
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Guest"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateGuestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateGuestForm />
    </Suspense>
  );
}
