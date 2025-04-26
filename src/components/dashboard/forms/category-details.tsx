"use client";

//React
import { FC, useEffect } from "react";

//prisma model
import { Category } from "@prisma/client";

// Form Handler Utils
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema Validation
import { CategoryFormSchema } from "@/lib/schemas";

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
import { upsertCategory } from "@/queries/category";

// utils
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play();
};

interface CategoryDetailsProps {
  data?: Category;
}
const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  // initializing necessary hooks
  const router = useRouter();

  // form handler for category details
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url,
      featured: data?.featured ?? false,
    },
  });

  const isLoading = form.formState.isSubmitting; // Loading state for form submission

  //rest form values when data is submitted
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      // upsert category data
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0]?.url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Display success message
      toast.success(
        data?.id
          ? "✅ Category updated successfully!"
          : `🎉 Category '${response?.name}' created!`
      );
      playSound("/success.wav");

      // redirect or refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
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
          <CardTitle className="capitalize">Category information</CardTitle>
          <CardDescription className="capitalize">
            {data?.id
              ? `Update ${data?.name} Category information`
              : "Lets Create a Category. You Can Edit Category Later from category table or category page"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
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
                name="name"
                render={({ field }) => {
                  console.log("👀 name field:", field);
                  return (
                    <FormItem className="flex-1">
                      <FormLabel>Category Name</FormLabel>
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
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/category-url"
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
                        This Category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="capitalize">
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save category information"
                  : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
