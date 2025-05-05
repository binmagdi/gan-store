import ProductPageContainer from "@/components/store/productPage/ProductPageContainer";
import { Separator } from "@/components/ui/separator";
import { getProductPageData } from "@/queries/product";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { productSlug: string; variantSlug: string };
  searchParams: {
    size?: string;
  };
}

export default async function ProductVariantPage({
  params: { productSlug, variantSlug },
  searchParams: { size: sizeId },
}: PageProps) {
  // fetch product data using the productSlug and variantSlug
  const productData = await getProductPageData(productSlug, variantSlug);

  if (!productData) {
    return notFound();
  }

  //   Extract the avilable sizes from the product variant data
  const { sizes } = productData;

  // if the size is provided in the URL
  if (sizeId) {
    // Check if the provided sizeId is valid by comparing it with the available sizes
    const isValidSize = sizes.some((size) => size.id === sizeId);

    if (!isValidSize) {
      // If the sizeId is not valid, return a 404 page
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  }
  //   if no sizeId is provided and there's only one size available, redirect to the same page with the sizeId in the URL
  else if (sizes.length === 1) {
    return redirect(
      `/product/${productSlug}/${variantSlug}?size=${sizes[0].id}`
    );
  }
  const relatedProducts = {
    products: [],
  };

  const { specs, questions } = productData;

  return (
    <div>
      <div className="max-w-[1650px] mx-auto overflow-x-hidden p-6">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related Products */}
            </>
          )}
          <Separator className="mt-6" />
          {/* Product Reviews */}
          <>
            <Separator className="mt-6" />
            {/* Product Description */}
          </>

          {(specs.productSpecs.length > 0 || specs.variantSpecs.length > 0) && (
            <>
              <Separator className="mt-6" />
              {/* Specs Table */}
            </>
          )}

          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/*Product Questions */}
            </>
          )}
          <Separator className="mt-6" />
          {/* Store Card */}
          {/* Store Products */}
        </ProductPageContainer>
      </div>
    </div>
  );
}
