import DataTable from "@/components/ui/data-table";
import { getAllStoreProducts } from "@/queries/product";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";

const SellerProductsPage = async ({
  params,
}: {
  params: { storeUrl: string };
}) => {
  // Fetching products data from the database for the active store

  const products = await getAllStoreProducts(params.storeUrl);

  const categories = await getAllCategories();
  
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} /> Create Product
        </>
      }
      modalChildren={
        <ProductDetails categories={categories} storeUrl={params.storeUrl} />
      }
      newTabLink={`/dashboard/seller/stores/${params.storeUrl}/products/new`}
      filterValue="name"
      data={products}
      columns={columns}
      searchPlaceholder="Search Product Name..."
    />
  );
};

export default SellerProductsPage;
