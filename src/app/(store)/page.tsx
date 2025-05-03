import ProductList from "@/components/store/shared/ProductList";
import { getProducts } from "@/queries/product";

export default async function HomePage() {
  const productsData = await getProducts();
  const { products } = productsData;
  return (
    <div className="px-4 lg:px-12 py-4">
      <ProductList products={products} title="Products" arrow />
    </div>
  );
}
