"use client";

//React
import { FC, useEffect, useRef, useState } from "react";

//prisma model
import { Category, SubCategory } from "@prisma/client";

// Form Handler Utils
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema Validation
import { ProductFormSchema } from "@/lib/schemas";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Queries
import { upsertProduct } from "@/queries/product";
import { getAllSubCategoriesForCategory } from "@/queries/category";

// ReactTags
import { WithOutContext as ReactTags } from "react-tag-input";

// utils
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// Types
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleX } from "lucide-react";

// React date-time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

// Jodit Text Editor

import JoditEditor from "jodit-react";

const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play();
};

interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  storeUrl: string;
}
const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  // initializing necessary hooks
  const router = useRouter();

  // Jodit editor Refs
  const productDescEditor = useRef(null);
  const variantDescEditor = useRef(null);

  // State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>([{ color: "" }]);

  // State for sizes
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >([{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

  // State for product specs
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  // State for product Variant specs
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  // State for questions
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  //temporary State for images
  const [images, setImages] = useState<{ url: string }[]>([]);

  // form handler for category details
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      description: data?.description,
      variantName: data?.variantName,
      variantDescription: data?.variantDescription,
      images: data?.images || [],
      variantImage: data?.variantImage ? [{ url: data.variantImage }] : [],
      categoryId: data?.categoryId,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand,
      sku: data?.sku,
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      product_specs: data?.product_specs,
      variant_specs: data?.variant_specs,
      keywords: data?.keywords,
      questions: data?.questions,
      isSale: data?.isSale,
      saleEndDate:
        data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    },
  });

  // UseEffect to get subCategories when user pick/change a category
  useEffect(() => {
    const getSubCategories = async () => {
      const res = await getAllSubCategoriesForCategory(form.watch().categoryId);
      setSubCategories(res);
    };
    getSubCategories();
  }, [form, form.watch().categoryId]);

  // Extract errors state from form
  const errors = form.formState.errors;

  // Loading state for form submission
  const isLoading = form.formState.isSubmitting;

  //rest form values when data is submitted
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        variantImage: [{ url: data.variantImage }],
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      // upsert store data
      const response = await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name: values.name,
          description: values.description,
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          images: values.images,
          variantImage: values.variantImage[0].url,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          isSale: values.isSale || false,
          saleEndDate: values.saleEndDate,
          brand: values.brand,
          sku: values.sku,
          colors: values.colors,
          sizes: values.sizes,
          product_specs: values.product_specs,
          variant_specs: values.variant_specs,
          keywords: values.keywords,
          questions: values.questions,

          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl
      );

      // Display success message
      toast.success(
        data?.productId && data?.variantId
          ? "✅ Product updated successfully!"
          : `🎉 Product '${response?.slug}' created!`
      );
      playSound("/success.wav");

      // redirect or refresh data
      if (data?.productId && data?.variantId) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}/products`);
      }
    } catch (error: any) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      toast.error("❌ Something went wrong: " + error.message);
      playSound("/error.wav");
    }
  };

  // Handle keywords input
  const [keywords, setKeywords] = useState<string[]>(data?.keywords || []);

  interface Keyword {
    id: string;
    text: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = (i: number) => {
    setKeywords(keywords.filter((_, index) => index !== i));
  };

  // Whenever colors, sizes, keywords changes we update the form values
  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
    form.setValue("questions", questions);
    form.setValue("product_specs", productSpecs);
    form.setValue("variant_specs", variantSpecs);
  }, [form, colors, sizes, keywords, productSpecs, variantSpecs, data]);

  console.log("🚀 ~ productSpecs:", form.getValues());
  console.log("🚀 ~ variantSpecs:", form.getValues().variant_specs);
  console.log("🚀 ~ questions:", form.getValues().questions);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="capitalize">Product information</CardTitle>
          <CardDescription className="capitalize">
            {data?.productId && data?.variantId
              ? `Update ${data?.name} Product information`
              : "Lets Create a Product. You Can Edit Product Later from the Product Page"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Images & Colors */}
              <div className="flex flex-col gap-y-6 ">
                {/* Images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <ImagesPreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url !== url
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="!mt-4" />

                          <ImageUpload
                            dontShowPreview
                            type="standard"
                            value={field.value?.map((image) => image.url) ?? []}
                            disabled={isLoading}
                            onChange={(url) => {
                              setImages((prevImages) => {
                                const updatedIages = [...prevImages, { url }];
                                field.onChange(updatedIages);
                                return updatedIages;
                              });
                              field.onChange([...field.value, { url }]);
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="w-full flex flex-col xl:pl-5 ">
                  <ClickToAddInputs
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive mt-2">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>Product Name</FormLabel>
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
                  name="variantName"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>Variant Name</FormLabel>
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
              </div>

              {/* Product and Variant description editors (taps) */}

              <Tabs defaultValue="product" className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-12">
                  <TabsTrigger value="product" className="capitalize h-10">
                    Product discription
                  </TabsTrigger>
                  <TabsTrigger value="variant" className="capitalize h-10">
                    variant discription
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="product">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={productDescEditor}
                              value={form.getValues().description}
                              onChange={(content) => {
                                form.setValue("description", content);
                              }}
                              className="!min-w-96 !max-w-[1000px] mx-auto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </TabsContent>
                <TabsContent value="variant">
                  <FormField
                    control={form.control}
                    name="variantDescription"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={variantDescEditor}
                              value={form.getValues().variantDescription || ""}
                              onChange={(content) => {
                                form.setValue("variantDescription", content);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </TabsContent>
              </Tabs>

              {/* Category & SubCategory */}

              <div className="flex flex-col lg:flex-row gap-4">
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

                {form.watch().categoryId && (
                  <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Sub-Category</FormLabel>
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
                                placeholder="Select a Sub-Category"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subCategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Brand & SKU */}

              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>Product Brand</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brand"
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
                  name="sku"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>Product Sku</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sku"
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

              {/* variant image & Keywords */}
              <div className="flex items-center gap-10 py-14">
                {/* Variant Image */}
                <div className="border-r pr-10">
                  <FormField
                    control={form.control}
                    name="variantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-14 capitalize">
                          Variant image
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            dontShowPreview
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
                        <FormMessage className="!mt-4" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Keywords */}

                <div className="w-full flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="relative flex-1">
                        <FormLabel>Product Keywords</FormLabel>
                        <FormControl>
                          <ReactTags
                            handleAddition={handleAddition}
                            handleDelete={() => {}}
                            placeholder="Keywords (e.g., winter jacket, warm, stylish)"
                            classNames={{
                              tagInputField:
                                "bg-background border rounded-md p-2 w-full focus:outline-none",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, i) => (
                      <div
                        key={i}
                        className="text-sm inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2"
                      >
                        <span>{k}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDeleteKeyword(i)}
                        >
                          <CircleX size={18} className="text-red-800" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInputs
                  details={sizes}
                  setDetails={setSizes}
                  initialDetail={{
                    size: "",
                    quantity: 1,
                    price: 0.01,
                    discount: 0,
                  }}
                  header="Size, Quantity, Price, Discount"
                  containerClassName="flex-1"
                  inputClassName="w-full"
                />
                {errors.sizes && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>

              {/* Product and Variant Spec */}

              <Tabs defaultValue="productSpecs" className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-12">
                  <TabsTrigger value="productSpecs" className="capitalize h-10">
                    Product Specifications
                  </TabsTrigger>
                  <TabsTrigger value="variantSpecs" className="capitalize h-10">
                    variant Specifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="productSpecs">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={productSpecs}
                      setDetails={setProductSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.product_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.product_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="variantSpecs">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={variantSpecs}
                      setDetails={setVariantSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.variant_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.variant_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Questions */}
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInputs
                  details={questions}
                  setDetails={setQuestions}
                  initialDetail={{
                    question: "",
                    answer: "",
                  }}
                  header="Q&A"
                  containerClassName="flex-1"
                  inputClassName="w-full"
                />
                {errors.sizes && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>

              {/* Is on Sale */}
              <div className="flex items-center border rounded-md">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-2 leading-none">
                        <FormLabel>On Sale?</FormLabel>
                        <FormDescription className="capitalize">
                          is this product on sale?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.getValues().isSale && (
                  <FormField
                    control={form.control}
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 p-4">
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <FormLabel>Enter Sale End Date</FormLabel>

                            <DateTimePicker
                              onChange={(date) => {
                                field.onChange(
                                  date
                                    ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                    : ""
                                );
                              }}
                              value={field.value ? new Date(field.value) : null}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="capitalize">
                {isLoading
                  ? "loading..."
                  : data?.productId && data?.variantId
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

export default ProductDetails;
