"use client";

//React
import { FC, useEffect } from "react";

//prisma model
import { Category, SubCategory } from "@prisma/client";

// Form Handler Utils
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema Validation
import { SubCategoryFormSchema } from "@/lib/schemas";

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
import { upsertSubCategory } from "@/queries/subCategory";

// utils
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play();
};

interface SubCategoryDetailsProps {
  data?: SubCategory;
  categories: Category[];
}
const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
  data,
  categories,
}) => {
  // initializing necessary hooks
  const router = useRouter();

  // form handler for category details
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SubCategoryFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url,
      featured: data?.featured ?? false,
      categoryId: data?.categoryId,
    },
  });

  const isLoading = form.formState.isSubmitting; // Loading state for form submission

  const formData = form.watch(); // Watching form data for changes
  console.log("👀 formData:", formData); // Debugging form data

  //rest form values when data is submitted
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
        categoryId: data?.categoryId,
      });
    }
  }, [data, form]);

  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>
  ) => {
    try {
      // upsert category data
      const response = await upsertSubCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0]?.url,
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Display success message
      toast.success(
        data?.id
          ? "✅ SubCategory updated successfully!"
          : `🎉 SubCategory '${response?.name}' created!`
      );
      playSound("/success.wav");

      // redirect or refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subCategories");
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
          <CardTitle className="capitalize">SubCategory information</CardTitle>
          <CardDescription className="capitalize">
            {data?.id
              ? `Update ${data?.name} SubCategory information`
              : "Lets Create a SubCategory. You Can Edit SubCategory Later from SubCategory table or SubCategory page"}
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
                      <FormLabel>SubCategory Name</FormLabel>
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
                    <FormLabel>SubCategory URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/subCategory-url"
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoading || categories.length == 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="capitalize"
                          >
                            {category.name}
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
                        This SubCategory will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="capitalize">
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save SubCategory information"
                  : "Create SubCategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
