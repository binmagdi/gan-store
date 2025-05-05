import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { space } from "postcss/lib/list";
import { FC } from "react";

interface SimplifiedSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface Props {
  sizeId?: string | undefined;
  sizes: SimplifiedSize[];
  isCard?: boolean;
}

const ProductPrice: FC<Props> = ({ sizeId, sizes, isCard }) => {
  // check if the size array is empty or not
  if (!sizes || sizes.length === 0) {
    return;
  }

  // senario 1: no sizeId passed , calculate range of prices and total quantity
  if (!sizeId) {
    const discountedPrices = sizes.map(
      (size) => size.price * (1 - size.discount / 100)
    );
    const totalQuantity = sizes.reduce(
      (total, size) => total + size.quantity,
      0
    );

    const minPrice = Math.min(...discountedPrices).toFixed(2);
    const maxPrice = Math.max(...discountedPrices).toFixed(2);

    // if all sizes are the same price, show only one price
    const priceDisplay =
      minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

    //   if a discount exists when minPrice = maxPrice,
    let discount = 0;
    if (minPrice === maxPrice) {
      let checkDiscount = sizes.find((size) => size.discount > 0);
      if (checkDiscount) {
        discount = checkDiscount.discount;
      }
    }
    return (
      <div>
        <div className="text-orange-primary inline-block font-bold leading-none mr-2.5">
          <span
            className={cn("inline-block text-4xl text-nowrap", {
              "text-lg": isCard,
            })}
          >
            {priceDisplay}
          </span>
        </div>
        {!sizeId && !isCard && (
          <div className="text-orange-primary text-xs leading-4 mt-1">
            <span>Note: Select a size to see the exact price</span>
          </div>
        )}
        {!sizeId && !isCard && (
          <p className="mt-2 text-xs capitalize">{totalQuantity} pieces</p>
        )}
      </div>
    );
  }

  // senario 2: sizeId passed, find the size object and display the price
  const selectedSize = sizes.find((size) => size.id === sizeId);
  if (!selectedSize) {
    return <></>;
  }

  //   calc the price after discount

  const discountedPrice =
    selectedSize.price * (1 - selectedSize.discount / 100);

  return (
    <div>
      <div className="text-orange-primary inline-block font-bold leading-none mr-2.5">
        <span className="inline-block text-4xl">
          ${discountedPrice.toFixed(2)}
        </span>
      </div>
      {selectedSize.price !== discountedPrice && (
        <span className="text-[#999] inline-block text-xl font-normal leading-6 mr-2 line-through">
          ${selectedSize.price.toFixed(2)}
        </span>
      )}
      {selectedSize.discount > 0 && (
        <span className="capitalize inline-block text-orange-seconadry text-xl leading-6">
          {selectedSize.discount}% off
        </span>
      )}
      <p className="mt-2 text-xs capitalize">{selectedSize.quantity} pieces</p>
    </div>
  );
};

export default ProductPrice;
