"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

export default function CreatePropertyPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isTestingCredentials, setIsTestingCredentials] = useState(false);

  const form = useForm<CreatePropertyForm>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      name: "as",
      address: "sss",
      hasSciaaLicense: false,
      alloggiatiConfig: {
        username: "NA018476",
        password: "4b9bNK3h",
        wsKey:
          "ADoKTiizs17PPZohkH0zoe6fkMtYT5MrzuE/JlEfgG3n2/YQDtKaRp2N5VnHddZJhg==",
      },
      apartments: [{ name: "app1", maxGuests: 1 }],
    },
  });

  const onSubmit = async (values: CreatePropertyForm) => {
    try {
      setIsPending(true);
      debugger;
      if (!isTestingCredentials) {
      }
      // If validation passes, create the property
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
    debugger;
    const alloggiatiConfig = form.getValues("alloggiatiConfig");

    // Validate that all fields are filled
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

      // Generate token
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
      // Test authentication
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
    } finally {
      setIsTestingCredentials(false);
      return false;
    }
  };

  const addApartment = () => {
    const apartments = form.getValues("apartments");
    form.setValue("apartments", [...apartments, { name: "", maxGuests: 1 }]);
  };

  const removeApartment = (index: number) => {
    const apartments = form.getValues("apartments");
    if (apartments.length > 1) {
      form.setValue(
        "apartments",
        apartments.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <Properties.Link>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
        </Properties.Link>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property name" {...field} />
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
                      <Input placeholder="Enter property address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasSciaaLicense"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Has SCIA License</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Alloggiati Configuration
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testAlloggiatiCredentials}
                    disabled={isTestingCredentials}
                    className="gap-2"
                  >
                    <TestTube className="h-4 w-4" />
                    {isTestingCredentials ? "Testing..." : "Test Credentials"}
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="alloggiatiConfig.username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
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
                          placeholder="Enter password"
                          {...field}
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
                        <Input placeholder="Enter WS Key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Apartments</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addApartment}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Apartment
                  </Button>
                </div>

                {form.watch("apartments").map((_, index) => (
                  <div key={index} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Apartment {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeApartment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`apartments.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter apartment name"
                              {...field}
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
                              min="1"
                              placeholder="Enter max guests"
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
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Property"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
