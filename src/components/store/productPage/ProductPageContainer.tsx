import { ProductPageDataType } from "@/lib/types";
import { FC, ReactNode } from "react";
import ProductSwiper from "./ProductSwiper";
import ProductInfo from "./ProductInfo/ProductInfo";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: FC<Props> = ({ productData, sizeId, children }) => {
  // if there is no product data available, return null
  if (!productData) return null;
  const { images } = productData;

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* Product image swiper */}
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
            <ProductInfo productData={productData} sizeId={sizeId} />
          {/* Buy actions card */}
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
