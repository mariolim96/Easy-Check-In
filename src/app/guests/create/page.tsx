"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

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

const memberSchema = z.object({
  stayLength: z
    .number()
    .min(1, "Stay length must be at least 1 day")
    .max(30, "Maximum stay is 30 days"), // Permanenza
  citizenship: z.string().min(1, "Citizenship is required"), // Cittadinanza
  placeOfBirth: z.string().min(1, "Place of birth is required"), // Luogo di Nascita
  firstName: z.string().min(1, "First name is required"), // Nome
  lastName: z.string().min(1, "Last name is required"), // Cognome
  dateOfBirth: z.string().min(1, "Date of birth is required"), // Data di Nascita
  gender: z.enum(["M", "F"]), // Sesso
  guestType: z.enum(["family_member", "group_member"]),
});

const guestSchema = z.object({
  guestType: z.enum([
    "single_guest", // Ospite Singolo
    "family_head", // Capo Famiglia
    "group_leader", // Capo Gruppo
    "family_member",
    "group_member",
  ]),
  arrivalDate: z.string().min(1, "Arrival date is required"), // Data di Arrivo
  stayLength: z
    .number()
    .min(1, "Stay length must be at least 1 day")
    .max(30, "Maximum stay is 30 days"), // Permanenza
  citizenship: z.string().min(1, "Citizenship is required"), // Cittadinanza
  placeOfBirth: z.string().min(1, "Place of birth is required"), // Luogo di Nascita
  firstName: z.string().min(1, "First name is required"), // Nome
  lastName: z.string().min(1, "Last name is required"), // Cognome
  dateOfBirth: z.string().min(1, "Date of birth is required"), // Data di Nascita
  gender: z.enum(["M", "F"]), // Sesso
  documentIssuePlace: z.string().min(1, "Document issue place is required"), // Luogo di Rilascio del Documento
  documentType: z.string().min(1, "Document type is required"), // Tipo Documento
  documentNumber: z.string().min(1, "Document number is required"), // Numero Documento
  members: z.array(memberSchema).optional(),
});

type CreateGuestForm = z.infer<typeof guestSchema>;

export default function CreateGuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const guestCount = Number(searchParams.get("guestCount")) || 1;

  const form = useForm<CreateGuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guestType: "single_guest",
      stayLength: 1,
      gender: "M",
      members: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const watchGuestType = form.watch("guestType");
  const isGroupOrFamily =
    watchGuestType === "family_head" || watchGuestType === "group_leader";

  const addMember = () => {
    append({
      stayLength: 1,
      citizenship: "",
      placeOfBirth: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "M",
      guestType:
        watchGuestType === "family_head" ? "family_member" : "group_member",
    });
  };

  const onSubmit = async (values: CreateGuestForm) => {
    try {
      setIsPending(true);
      //   await Encore.Guest.createGuest(values);
      toast.success("Guest created successfully");
      router.back();
    } catch (error) {
      toast.error("Failed to create guest");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Guest</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
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
                  name="stayLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stay Length (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={30}
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

                <FormField
                  control={form.control}
                  name="citizenship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizenship</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentIssuePlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Issue Place</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                        <Input {...field} />
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
                          <FormField
                            control={form.control}
                            name={`members.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                  <Input {...field} />
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
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.placeOfBirth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Place of Birth</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`members.${index}.stayLength`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stay Length (days)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={30}
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
