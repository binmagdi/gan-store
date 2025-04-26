"use client";

//React
import { FC, useEffect } from "react";

// Form Handler Utils
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema Validation
import { StoreShippingFormSchema } from "@/lib/schemas";

// Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@tremor/react";

// Queries
import { upsertCategory } from "@/queries/category";

// utils
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StoreDefaultShippingType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { updateStoreDefaultShippingDetails } from "@/queries/store";

const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play();
};

interface StoreDefaultShippingDetailsProps {
  data?: StoreDefaultShippingType;
  storeUrl: string;
}
const StoreDefaultShippingDetails: FC<StoreDefaultShippingDetailsProps> = ({
  data,
  storeUrl,
}) => {
  // initializing necessary hooks
  const router = useRouter();

  // form handler for category details
  const form = useForm<z.infer<typeof StoreShippingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      defaultShippingService: data?.defaultShippingService || "",
      defaultShippingFeePerItem: data?.defaultShippingFeePerItem,
      defaultShippingFeeForAdditionalItem:
        data?.defaultShippingFeePerForAdditionalItem,
      defaultShippingFeePerKg: data?.defaultShippingFeePerKg,
      defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax,
      defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin,
      returnPolicy: data?.returnPolicy,
    },
  });

  const isLoading = form.formState.isSubmitting; // Loading state for form submission

  //rest form values when data is submitted
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const handleSubmit = async (
    values: z.infer<typeof StoreShippingFormSchema>
  ) => {
    try {
      // upsert category data
      const response = await updateStoreDefaultShippingDetails(storeUrl, {
        defaultShippingService: values.defaultShippingService,
        defaultShippingFeePerItem: values.defaultShippingFeePerItem,
        defaultShippingFeePerForAdditionalItem:
          values.defaultShippingFeeForAdditionalItem,
        defaultShippingFeePerKg: values.defaultShippingFeePerKg,
        defaultShippingFeeFixed: values.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: values.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: values.defaultDeliveryTimeMax,
        returnPolicy: values.returnPolicy,
      });

     if (response.id) {
       // Display success message
       toast.success(
        "✅ Store default shipping details has been updated successfully!"
      );
      playSound("/success.wav");

      //  refresh data

      router.refresh();
     }
    } catch (error: any) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      toast.error("❌ Something went wrong: " + error.message);
      playSound("/error.wav");
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="capitalize">Store Default Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1 capitalize">
                      <FormLabel className="capitalize">Shipping Service Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex flex-wrap gap-4 ">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerKg"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 capitalize">
                        <FormLabel>Shipping fee per kg</FormLabel>
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            min={0}
                            step={0.1}
                            className="!px-3 !shadow-none rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="defaultShippingFeeFixed"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 capitalize">
                        <FormLabel>fixed shipping fee</FormLabel>
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            min={0}
                            step={0.1}

                            className="!px-3 !shadow-none rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 ">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerItem"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 capitalize">
                        <FormLabel>Shipping fee per item</FormLabel>
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            min={0}
                            step={0.1}

                            className="!px-3 !shadow-none rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="defaultShippingFeeForAdditionalItem"
                  render={({ field }) => {
                    console.log("👀 name field:", field);
                    return (
                      <FormItem className="flex-1 capitalize">
                        <FormLabel>Shipping fee for Additional item</FormLabel>
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            min={0}
                            step={0.1}

                            className="!px-3 !shadow-none rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 ">
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMin"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 capitalize">
                        <FormLabel>Minimum Delivery Time (days)</FormLabel>
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            min={1}
                            className="!px-3 !shadow-none rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMax"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 capitalize">
                        <FormLabel>Maximum Delivery Time (days)</FormLabel>
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            min={1}
                            className="!px-3 !shadow-none rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1 capitalize">
                      <FormLabel>return policy</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="what's the return policy for your store"
                          disabled={isLoading}
                          {...field}
                          className="capitalize"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" disabled={isLoading} className="capitalize">
                {isLoading ? "loading..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDefaultShippingDetails;
