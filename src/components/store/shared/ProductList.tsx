import { ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import ProductCard from "../cards/products/ProductCard";

interface props {
  products: ProductType[];
  title?: string;
  link?: string;
  arrow?: boolean;
}

const ProductList: FC<props> = ({ products, title, link, arrow }) => {
  const Title = () => {
    if (link) {
      <Link href={link} className="h-12 ">
        <h2 className="text-main-primary text-xl font-bold">
          {title}&nbsp;{arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      </Link>;
    } else {
      return (
        <h2 className="text-main-primary text-xl font-bold">
          {title}&nbsp;{arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      );
    }
  };

  return (
    <div className="relative">
      {title && <Title />}
      {products.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap -translate-x-5 w-[calc(100%+3rem)] sm:w-[calc(100%+1.5re)]",
            {
              "mt-2": title,
            }
          )}
        >
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      ) : (
        "No products found"
      )}
    </div>
  );
};

export default ProductList;
