import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { productSlug: string };
}) {
  const product = await db.product.findUnique({
    where: {
      slug: params.productSlug,
    },
    include: {
      variants: true,
    },
  });
  // If the product is not found, redirect to the home page
  if (!product) {
    return redirect("/");
  }
  // If the product has no variants, redirect to the home page
  if (!product.variants.length) {
    return redirect("/");
  }

  // If the product has only one variant, redirect to the variant page
  return redirect(`/product/${product.slug}/${product.variants[0].slug}`);
}
