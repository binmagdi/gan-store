"use client";

import { ProductPageDataType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { CopyIcon } from "../../icons";
import { toast } from "react-hot-toast";
import ReactStars from "react-rating-stars-component";

interface Props {
  productData: ProductPageDataType;
  quantity?: number;
  sizeId: string | undefined;
}

const ProductInfo: FC<Props> = ({ productData, sizeId, quantity }) => {
  // if there is no product data available, return null
  if (!productData) return null;
  // destructure the product data to get the required fields
  const {
    productId,
    name,
    sku,
    colors,
    variantImages,
    sizes,
    isSale,
    saleEndDate,
    variantName,
    store,
    rating,
    numberOfReviews,
    description,
  } = productData;

  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      toast.success("SKU copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy SKU to clipboard");
    }
  };
  return (
    <div className="relative w-full xl:w-[540px]">
      {/* Title */}
      <div>
        <h1 className="text-main-primary inline font-bold leading-5 capitalize">
          {name} • {variantName}
        </h1>
      </div>
      {/* Sku - rating - num reviews */}
      <div className="flex items-center text-xs mt-2">
        {/* Store Details */}
        <Link
          href={`/store/${store.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="w-full flex items-center gap-x-1">
            <Image
              src={store.logo}
              alt={store.name}
              height={100}
              width={100}
              className="w-8 h-8 rounded-full object-fill"
            />
          </div>
        </Link>
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
            SKU: {sku}
          </span>
          <span
            className="inline-block align-middle text-[#2f68a8] mx-1 cursor-pointer"
            onClick={copySkuToClipboard}
          >
            <CopyIcon />
          </span>
        </div>
        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap">
          <ReactStars
            count={5}
            size={24}
            color="#F5F5F5"
            activeColor="#FFD804"
            value={rating}
            isHalf
            edit={false}
          />
          <Link href="#reviews" className="text-[#ffd804] hover:underline">
            (
            {numberOfReviews === 0
              ? "Be the first to review"
              : numberOfReviews === 1
              ? "1 review"
              : `${numberOfReviews} reviews`}
            )
          </Link>
        </div>
      </div>
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice />
      </div>
    </div>
  );
};

export default ProductInfo;
