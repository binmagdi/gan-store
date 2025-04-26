import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import { getAllCategories } from "@/queries/category";

const AdminSubCategoriesPage = async () => {
    
  const categories = await getAllCategories();
  return <SubCategoryDetails categories={categories} />;
};

export default AdminSubCategoriesPage;
