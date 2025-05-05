"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { toast } from "sonner";
import { useModal } from "@/providers/modal-provider";

const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play();
};

// Lucide icons
import { CopyPlus, FilePenLineIcon, MoreHorizontal, Trash } from "lucide-react";

// Queries
import { deleteProduct } from "@/queries/product";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// Prisma models
import { StoreProductType } from "@/lib/types";
import Link from "next/link";

export const columns: ColumnDef<StoreProductType>[] = [
  {
    accessorKey: "name",
    header: "Product Details",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-3 ">
          <h1 className="font-bold truncate pb-3 border-b capitalize">
            {row.original.name}
          </h1>
          <div className="relative flex flex-wrap gap-4">
            {row.original.variants.map((v) => (
              <div key={v.id} className="flex flex-col gap-y-2 group ">
                <div className="relative cursor-pointer flex flex-col items-center">
                  <Image
                    src={v.images[0].url}
                    alt={`${v.variantName} image`}
                    width={1000}
                    height={1000}
                    className="min-w-40 max-w-40 h-40 rounded-full object-cover shadow-md"
                  />
                  <Link
                    href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/${v.id}`}
                  >
                    <div className="w-full h-full absolute top-0 left-0 bottom-0 right-0 z-10 rounded-sm bg-black/20 transition-all duration-150 hidden group-hover:block ">
                      <FilePenLineIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                  </Link>
                  {/* info */}
                  <div className="flex mt-2 gap-2 p-1">
                    {/* Colors */}
                    <div className="w-7 flex flex-col gap-2 rounded-md">
                      {v.colors.map((color) => (
                        <span
                          key={color.name}
                          className="w-5 h-5 rounded-full shadow-md"
                          style={{ backgroundColor: color.name }}
                        ></span>
                      ))}
                    </div>
                    <div>
                      {/* Name Of Variant */}
                      <h1 className="max-w-40 capitalize text-sm">
                        {v.variantName}
                      </h1>
                      {/* Sizes */}
                      <div className="flex flex-wrap gap-2 max-w-72 mt-1">
                        {v.sizes.map((size) => (
                          <span
                            key={size.size}
                            className="w-fit p-1 rounded-md text-[11px] font-medium border-2 bg-white/10 capitalize "
                          >
                            {size.size} - ({size.quantity}) - {size.price}£
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.category.name}</span>;
    },
  },
  {
    accessorKey: "subCategory",
    header: "SubCategory",
    cell: ({ row }) => {
      return (
        <span className="capitalize">{row.original.subCategory.name}</span>
      );
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.brand}</span>;
    },
  },

  {
    accessorKey: "new-variant",
    header: "+ new variant",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variant/new`}
        >
          <CopyPlus className="hover:text-blue-300" />
        </Link>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions productId={rowData.id} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  productId: string;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ productId }) => {
  // Hooks
  const { setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Return null if rowData or rowData.id don't exist
  if (!productId) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete Product
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            Product and variant that exist in side product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteProduct(productId);
              toast.success("Product deleted successfully", {
                description: "The Product has been deleted.",
              });
              playSound("/success.wav");

              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
