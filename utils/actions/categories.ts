"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { categorySchema, validateFuctionSchema } from "../schema";
import { getAuthUser, getAdminUser } from "./user";
import { runAction } from "./helpers";

// These are the MEDICINE categories (pharmacy).

// All categories with the number of medicines in each one (sorted by name).
export async function fetchCategories() {
  await getAuthUser();

  return db.medicineCategory.findMany({
    include: { _count: { select: { medicines: true } } },
    orderBy: { name: "asc" },
  });
}

// Create a new category.
export async function createCategoryAction(prevState: any, formData: FormData) {
  await getAdminUser();

  return runAction(async () => {
    const fields = validateFuctionSchema(categorySchema, Object.fromEntries(formData));

    await db.medicineCategory.create({ data: fields });

    revalidatePath("/pharmacy/categories");
    return "Category created successfully";
  });
}

// Delete a category.
export async function deleteCategoryAction({ categoryId }: { categoryId: string }) {
  await getAdminUser();

  return runAction(async () => {
    await db.medicineCategory.delete({ where: { id: categoryId } });

    revalidatePath("/pharmacy/categories");
    return "Category deleted successfully";
  });
}
