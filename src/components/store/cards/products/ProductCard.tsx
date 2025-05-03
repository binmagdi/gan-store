"use client";

import { ProductType, VariantSimplified } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import ProductCardImageSwiper from "./ProductCardImageSwiper";
import VariantSwitcher from "./VariantSwitcher";
import { Button } from "@/components/store/ui/button";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: ProductType }) {
  const { name, slug, rating, sales, variantImages, variants } = product;
  const [variant, setVariant] = useState<VariantSimplified>(variants[0]);
  const { images, variantSlug, variantName, sizes } = variant;
  return (
    <div>
      <div className="group w-48 sm:w-[225px] relative transition-all duration-75 bg-white ease-in-out p-4 rounded-3xl border border-transparent hover:shadow-md hover:border-border ml-6 mb-6">
        <div className="relative w-full h-full ">
          <Link
            href={`/product/${slug}/${variantSlug}`}
            className="w-full relative inline-block overflow-hidden"
          >
            {/* Image Swiper */}
            <ProductCardImageSwiper key={product.id} images={images} />
            {/* Title */}
            <div className="text-sm text-main-primary h-[18px] overflow-hidden overflow-ellipsis line-clamp-1">
              {name} • {variantName}
            </div>
            {/* Rating - Sales */}
            {product.rating > 0 && product.sales > 0 && (
              <div className="flex items-center gap-x-1 h-5">
                <ReactStars
                  count={5}
                  size={24}
                  color="#F5F5F5"
                  activeColor="#FFD804"
                  value={rating}
                  isHalf
                  edit={false}
                />
                <div className="text-xs text-main-secondary capitalize ">
                  {sales} sold
                </div>
              </div>
            )}
            {/* Price */}
          </Link>
          <div className=" bg-white -0 w-full  pb-4 rounded-b-3xl z-30 space-y-2">
            {/* Variant Switcher */}
            <VariantSwitcher
              images={variantImages}
              variants={variants}
              setVariant={setVariant}
              selectedVariant={variant}
            />

            {/* Action Bottons */}
            <div className="flex flex-items gap-x-1">
              <Button variant="default">Add To Cart</Button>
              <Button variant="black" size="icon">
                <Heart className="w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
