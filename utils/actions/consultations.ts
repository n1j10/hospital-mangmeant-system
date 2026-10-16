"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { consultationSchema, validateFuctionSchema } from "../schema";
import { getAuthUser } from "./user";
import { runAction, orRedirect, contains, doctorWithUser, prescriptionsWithMedicine } from "./helpers";

// Load the consultation together with its patient, doctor, appointment and medicines.
// (Used for the list and for the single page.)
const consultationInclude = {
  patient: true,
  doctor: doctorWithUser,
  appointment: true,
  prescriptions: prescriptionsWithMedicine,
} as const;

// All consultations. Optional filter: search by patient name or diagnosis.
export async function fetchConsultations(search?: string) {
  await getAuthUser();

  return db.consultation.findMany({
    where: {
      OR: search
        ? [{ patient: { fullName: contains(search) } }, { diagnosis: contains(search) }]
        : undefined,
    },
    include: consultationInclude,
    orderBy: { createdAt: "desc" },
  });
}

// One consultation. If it does not exist, go to the consultations page.
export async function fetchSingleConsultation(id: string) {
  await getAuthUser();

  const consultation = await db.consultation.findUnique({
    where: { id },
    include: consultationInclude,
  });
  return orRedirect(consultation, "/consultations");
}

// Create a consultation and mark its appointment as COMPLETED.
export async function createConsultationAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const fields = validateFuctionSchema(consultationSchema, Object.fromEntries(formData));

    // Two things must happen together:
    // 1. create the consultation
    // 2. mark the appointment as COMPLETED
    // $transaction means: if one fails, both are cancelled
    await db.$transaction([
      db.consultation.create({
        data: {
          appointmentId: fields.appointmentId,
          patientId: fields.patientId,
          doctorId: fields.doctorId,
          diagnosis: fields.diagnosis || null,
          notes: fields.notes || null,
        },
      }),
      db.appointment.update({
        where: { id: fields.appointmentId },
        data: { status: "COMPLETED" },
      }),
    ]);

    revalidatePath("/consultations");
    revalidatePath("/appointments");
    return "Consultation created successfully";
  });
}
