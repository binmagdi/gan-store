import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";
import { getProductMainInfo } from "@/queries/product";
import React from "react";

const SellerNewProductVariantPage = async ({
  params,
}: {
  params: { storeUrl: string; productId: string };
}) => {
    const categories = await getAllCategories();
    const product= await getProductMainInfo(params.productId)
    if(!product) return null;
  return <div><ProductDetails
  categories={categories}
  storeUrl={params.storeUrl}
  data={product}


  /></div>;
};

export default SellerNewProductVariantPage;
