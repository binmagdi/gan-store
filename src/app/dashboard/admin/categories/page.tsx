// queries
import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import CustomModal from "@/components/dashboard/shared/custom-modal";

const AdminCategoriesPage = async () => {
  // fetch categories from db
  const categories = await getAllCategories();

  if (!categories) return null;

  return (
    
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} /> Create Category
          </>
        }
        modalChildren={<CategoryDetails />}
        filterValue="name"
        data={categories}
        searchPlaceholder="Search categories name..."
        columns={columns}
        newTabLink="/dashboard/admin/categories/new"
      />
    
  );
};

export default AdminCategoriesPage;
