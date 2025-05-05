"use client";

import { cn } from "@/lib/utils";
import { ProductVariantImage } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import ImageZoom from "react-image-zooom";

export default function ProductSwiper({
  images,
}: {
  images: ProductVariantImage[];
}) {
  // if no images are available, return null
  if (!images || images.length === 0) return;

  //   useState to manage the active image being displayed, initialized to the first image in the array
  const [activeImage, setActiveImage] = useState<ProductVariantImage>(
    images[0]
  );
  return (
    <div className="relative">
      <div className="relative w-full flex flex-col-reverse xl:flex-row gap-2">
        {/* Thumnails */}
        <div className="flex flex-wrap xl:flex-col gap-3">
          {images.map((image) => (
            <div
              key={image.url}
              className={cn(
                "w-16 h-16 rounded-md grid place-items-center overflow-hidden border border-gray-100 cursor-pointer transition-all duration-75 ease-in",
                {
                  "border-main-primary": activeImage.id === image.id,
                }
              )}
              onMouseEnter={() => setActiveImage(image)}
            >
              <Image
                src={image.url}
                priority
                width={100}
                height={100}
                alt={image.alt}
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>
        {/* Main image */}
        <div className="w-full  2xl:h-[600px] 2xl:w-[600px] rounded-md overflow-hidden relative">
          <ImageZoom
            src={activeImage.url}
            zoom={200}
            alt={activeImage.alt}
            className="object-cover rounded-md !w-full"
          />
          </div>
      </div>
    </div>
  );
}
