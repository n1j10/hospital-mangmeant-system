"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { prescriptionItemSchema, validateFuctionSchema } from "../schema";
import { getAuthUser } from "./user";
import { runAction } from "./helpers";

// Add a medicine to a consultation's prescription.
export async function addPrescriptionItemAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const fields = validateFuctionSchema(prescriptionItemSchema, Object.fromEntries(formData));

    await db.prescriptionItem.create({ data: fields });

    revalidatePath(`/consultations/${fields.consultationId}`);
    return "Prescription item added";
  });
}

// Remove one medicine from a prescription.
export async function removePrescriptionItemAction({
  itemId,
  consultationId,
}: {
  itemId: string;
  consultationId: string;
}) {
  await getAuthUser();

  return runAction(async () => {
    await db.prescriptionItem.delete({ where: { id: itemId } });

    revalidatePath(`/consultations/${consultationId}`);
    return "Prescription item removed";
  });
}
