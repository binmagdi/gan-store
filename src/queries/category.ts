"use server";

// clerk
import { currentUser } from "@clerk/nextjs/server";
//prisma model
// db
import { db } from "@/lib/db";
import { Category } from "@prisma/client";

// upsert category into db
export const upsertCategory = async (category: Category) => {
  try {
    // get current user
    const user = await currentUser();

    // user is authenticated
    if (!user) throw new Error("User is not authenticated");

    // verify admin permission
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("User is not admin");

    // check category data is provided
    if (!category) throw new Error("please provide category data");

    // throw error if category with same name or url already exists
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: {
              id: category.id,
            },
          },
        ],
      },
    });

    // throw error if category with same name or url already exists
    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "Category with the same name already exists";
      } else if (existingCategory.url === category.url) {
        errorMessage = "Category with the same url already exists";
      }
      throw new Error(errorMessage);
    }

    // upsert category into db
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: {
        name: category.name,
        image: category.image,
        url: category.url,
        featured: category.featured,
        updatedAt: new Date(),
      },
      create: {
        id: category.id,
        name: category.name,
        image: category.image,
        url: category.url,
        featured: category.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return categoryDetails;
  } catch (error) {
    console.log("🚀 ~ upsertCategory ~ error:", error);
    throw error;
  }
};

// get all categories from db
export const getAllCategories = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};


// get all SubCategories for a category from db
export const getAllSubCategoriesForCategory = async (categoryId : string) => {
  const subCategories = await db.subCategory.findMany({
    where:{
      categoryId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// get category by id from db
export const getCategory = async (categoryId: string) => {
  if (!categoryId) throw new Error("please provide category ID.");
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  return category;
};

// delete category by id from db
export const deleteCategory = async (categoryId: string) => {
  const user = await currentUser();

  if (!user) throw new Error("User is not authenticated");

  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("User is not admin");

  if (!categoryId) throw new Error("please provide category ID.");
  const response  = await db.category.delete({
    where: {
      id: categoryId,
    },
  });
  return response;
};
