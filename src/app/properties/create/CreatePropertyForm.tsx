"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft, TestTube } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Properties } from "@/routes";
import { Encore } from "@/lib/utils";

const apartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  maxGuests: z.number().min(1, "Must have at least 1 guest"),
});

const createPropertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  hasSciaaLicense: z.boolean().default(false),
  alloggiatiConfig: z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    wsKey: z.string().min(1, "WS Key is required"),
  }),
  apartments: z
    .array(apartmentSchema)
    .min(1, "At least one apartment is required"),
});

type CreatePropertyForm = z.infer<typeof createPropertySchema>;

export function CreatePropertyForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isTestingCredentials, setIsTestingCredentials] = useState(false);

  const form = useForm<CreatePropertyForm>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      name: "",
      address: "",
      hasSciaaLicense: false,
      alloggiatiConfig: {
        username: "NA018476",

        password: "4b9bNK3h",
        wsKey: "",
      },
      apartments: [{ name: "", maxGuests: 1 }],
    },
  });

  // Use useFieldArray hook to manage dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "apartments",
  });

  const onSubmit = async (values: CreatePropertyForm) => {
    try {
      setIsPending(true);
      await Encore.Property.createProperty(values);
      toast.success("Property created successfully");
      router.push(Properties());
      router.refresh();
    } catch (error) {
      toast.error("Failed to create property");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const testAlloggiatiCredentials = async () => {
    const alloggiatiConfig = form.getValues("alloggiatiConfig");

    if (
      !alloggiatiConfig.username ||
      !alloggiatiConfig.password ||
      !alloggiatiConfig.wsKey
    ) {
      toast.error("Please fill in all Alloggiati credentials");
      return;
    }

    try {
      setIsTestingCredentials(true);
      const tokenResponse = await Encore.Alloggiati.generateToken({
        Utente: alloggiatiConfig.username,
        Password: alloggiatiConfig.password,
        WsKey: alloggiatiConfig.wsKey,
      });

      if (tokenResponse.error) {
        toast.error("Invalid Alloggiati credentials", {
          description: tokenResponse.error,
        });
        return false;
      }

      const testResponse = await Encore.Alloggiati.testAuthentication({
        Utente: alloggiatiConfig.username,
        token: tokenResponse.token,
      });

      if (testResponse.ErroreDettaglio) {
        toast.error("Alloggiati authentication failed", {
          description: testResponse.ErroreDettaglio,
        });
        return false;
      }

      toast.success("Alloggiati credentials are valid!");
      return true;
    } catch (error) {
      toast.error("Failed to test Alloggiati credentials");
      console.error(error);
      return false;
    } finally {
      setIsTestingCredentials(false);
    }
  };

  const addApartment = () => {
    append({ name: "", maxGuests: 1 });
  };

  const removeApartment = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push(Properties())}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Create New Property</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Property Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter property name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter property address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasSciaaLicense"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has SCIA License</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Alloggiati Config Card */}
          <Card>
            <CardHeader>
              <CardTitle>Alloggiati Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="alloggiatiConfig.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alloggiatiConfig.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alloggiatiConfig.wsKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WS Key</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter WS Key" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="secondary"
                onClick={testAlloggiatiCredentials}
                disabled={isTestingCredentials}
                className="gap-2"
              >
                <TestTube className="h-4 w-4" />
                {isTestingCredentials ? "Testing..." : "Test Credentials"}
              </Button>
            </CardContent>
          </Card>

          {/* Apartments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Apartments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Apartment {index + 1}
                    </h3>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeApartment(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`apartments.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter apartment name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`apartments.${index}.maxGuests`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Guests</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
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
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addApartment}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Apartment
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(Properties())}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
