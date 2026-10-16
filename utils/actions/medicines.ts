"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { medicineSchema, validateFuctionSchema } from "../schema";
import { getAuthUser, getAdminUser } from "./user";
import { runAction, orRedirect, contains, lowStockFilter, getDateAfterDays } from "./helpers";

// Load the medicine with its category.
const medicineInclude = { category: true } as const;

// The medicine form is used in both create and update.
// This function checks the form and returns the data ready for the database.
const readMedicineForm = (formData: FormData) => {
  const fields = validateFuctionSchema(medicineSchema, Object.fromEntries(formData));

  return {
    name: fields.name,
    categoryId: fields.categoryId,
    quantity: fields.quantity,
    unit: fields.unit || null,
    price: fields.price,
    expiryDate: new Date(fields.expiryDate),
    lowStockThreshold: fields.lowStockThreshold,
  };
};

// All medicines. Optional filters: search by name and/or category.
export async function fetchMedicines({
  search,
  categoryId,
}: {
  search?: string;
  categoryId?: string;
} = {}) {
  await getAuthUser();

  return db.medicine.findMany({
    where: {
      categoryId: categoryId || undefined,
      name: search ? contains(search) : undefined,
    },
    include: medicineInclude,
    orderBy: { createdAt: "desc" },
  });
}

// One medicine (with its category). If it does not exist, go to the pharmacy page.
export async function fetchSingleMedicine(id: string) {
  await getAuthUser();

  const medicine = await db.medicine.findUnique({ where: { id }, include: medicineInclude });
  return orRedirect(medicine, "/pharmacy");
}

// The medicines that are almost finished (lowest quantity first).
export async function fetchLowStockMedicines() {
  await getAuthUser();

  return db.medicine.findMany({
    where: lowStockFilter,
    include: medicineInclude,
    orderBy: { quantity: "asc" },
  });
}

// The medicines that expire in the next 30 days (or already expired).
export async function fetchExpiringMedicines() {
  await getAuthUser();

  return db.medicine.findMany({
    where: { expiryDate: { lte: getDateAfterDays(30) } },
    include: medicineInclude,
    orderBy: { expiryDate: "asc" },
  });
}

// Add a new medicine.
export async function createMedicineAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const fields = readMedicineForm(formData);

    await db.medicine.create({ data: fields });

    revalidatePath("/pharmacy");
    return "Medicine added successfully";
  });
}

// Update a medicine.
export async function updateMedicineAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const medicineId = formData.get("id") as string;
    const fields = readMedicineForm(formData);

    await db.medicine.update({ where: { id: medicineId }, data: fields });

    revalidatePath("/pharmacy");
    return "Medicine updated successfully";
  });
}

// Delete a medicine.
export async function deleteMedicineAction({ medicineId }: { medicineId: string }) {
  await getAdminUser();

  return runAction(async () => {
    await db.medicine.delete({ where: { id: medicineId } });

    revalidatePath("/pharmacy");
    return "Medicine deleted successfully";
  });
}
