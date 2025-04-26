import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

const AdminSubCategoriesPage = async () => {
  // Fetch all subcategories from the database
  const subCategories = await getAllSubCategories();
  // Check if no subcategories are found
  if (!subCategories) return null;

  // fetch all categories from the database
  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} /> Create Sub-Category
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search Sub-Category Name..."
      columns={columns}
      newTabLink="/dashboard/admin/subCategories/new"

    />
  );
};

export default AdminSubCategoriesPage;
