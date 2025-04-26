"use server";

import { db } from "@/lib/db";

export async function updateVariantImage() {
  try {
    // Fetch all product Variants that have images
    const variants = await db.productVariant.findMany({
      include: {
        images: true,
      },
    });

    // Update each variant with the first image url
    for (const variant of variants) {
      if (variant.images.length > 0) {
        const firstImage = variant.images[0];
        await db.productVariant.update({
          where: { id: variant.id },
          data: {
            variantImage: firstImage.url,
          },
        });
        console.log(
          `updated variant ${variant.id} with image ${firstImage.url}`
        );
      }
    }
    console.log(
      "All Product variants have been updated with their first image"
    );
  } catch (error) {
    console.log("🚀 ~ updateVariantImage ~ error:", error);
  }
}
