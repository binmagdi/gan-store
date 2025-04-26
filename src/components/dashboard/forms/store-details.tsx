"use client";

//React
import { FC, useEffect } from "react";

//prisma model
import { Store } from "@prisma/client";

// Form Handler Utils
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema Validation
import { StoreFormSchema } from "@/lib/schemas";

// Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/ImageUpload";

// Queries
import { upsertStore } from "@/queries/store";

// utils
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play();
};

interface StoreDetailsProps {
  data?: Store;
}
const StoreDetails: FC<StoreDetailsProps> = ({ data }) => {
  // initializing necessary hooks
  const router = useRouter();

  // form handler for category details
  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      description: data?.description,
      email: data?.email,
      phone: data?.phone,
      logo: data?.logo ? [{ url: data?.logo }] : [],
      cover: data?.cover ? [{ url: data?.cover }] : [],
      url: data?.url,
      featured: data?.featured ?? false,
      status: data?.status.toString(),
    },
  });

  const isLoading = form.formState.isSubmitting; // Loading state for form submission

  //rest form values when data is submitted
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        logo: [{ url: data?.logo }],
        cover: [{ url: data?.cover }],
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    try {
      // upsert store data
      const response = await upsertStore({
        id: data?.id ? data.id : v4(),
        name: values.name,
        description: values.description,
        email: values.email,
        phone: values.phone,
        logo: values.logo[0].url,
        cover: values.cover[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Display success message
      toast.success(
        data?.id
          ? "✅ Store updated successfully!"
          : `🎉 Store '${response?.name}' created!`
      );
      playSound("/success.wav");

      // redirect or refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${response?.url}`);
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
          <CardTitle className="capitalize">Store information</CardTitle>
          <CardDescription className="capitalize">
            {data?.id
              ? `Update ${data?.name} Store information`
              : "Lets Create a Store. You Can Edit Store Later from Store Settings Page"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Logo & Cover */}
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-60">
                      <FormControl>
                        <ImageUpload
                          type="profile"
                          value={field.value?.map((image) => image.url) ?? []}
                          disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
                          value={field.value?.map((image) => image.url) ?? []}
                          disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Name */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <FormLabel>Store Name</FormLabel>
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
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Email & Phone */}
              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>Store Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            disabled={isLoading}
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone"
                            disabled={isLoading}
                            {...field}
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
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/store-url"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription className="capitalize">
                        This store will appear on the home page.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="capitalize">
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save store information"
                  : "Create store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
