"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { patientSchema, validateFuctionSchema } from "../schema";
import type { Gender } from "@/lib/generated/prisma/enums";
import { getAuthUser, getAdminUser } from "./user";
import { runAction, orRedirect, contains, doctorWithUser, prescriptionsWithMedicine } from "./helpers";

// The patient form is used in both create and update.
// This function checks the form and returns the data ready for the database.
const readPatientForm = (formData: FormData) => {
  const fields = validateFuctionSchema(patientSchema, Object.fromEntries(formData));

  return {
    fullName: fields.fullName,
    gender: fields.gender as Gender,
    dateOfBirth: new Date(fields.dateOfBirth),
    phone: fields.phone,
    address: fields.address || null,
    bloodType: fields.bloodType || null,
  };
};

// All patients. Optional filter: search by name or phone.
export async function fetchPatients(search?: string) {
  await getAuthUser();

  return db.patient.findMany({
    where: {
      OR: search
        ? [{ fullName: contains(search) }, { phone: { contains: search } }]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
}

// One patient with his appointments, consultations and admissions.
// If he does not exist, go to the patients page.
export async function fetchSinglePatient(id: string) {
  await getAuthUser();

  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { doctor: doctorWithUser, department: true },
        orderBy: { scheduledAt: "desc" },
      },
      consultations: {
        include: { doctor: doctorWithUser, prescriptions: prescriptionsWithMedicine },
        orderBy: { createdAt: "desc" },
      },
      admissions: {
        include: { doctor: doctorWithUser, department: true },
        orderBy: { admitDate: "desc" },
      },
    },
  });
  return orRedirect(patient, "/patients");
}

// All patients for the <select> dropdowns.
export async function fetchAllPatientsForSelect() {
  await getAuthUser();

  return db.patient.findMany({ orderBy: { fullName: "asc" } });
}

// Register a new patient.
export async function createPatientAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const fields = readPatientForm(formData);

    await db.patient.create({ data: fields });

    revalidatePath("/patients");
    return "Patient registered successfully";
  });
}

// Update a patient.
export async function updatePatientAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const patientId = formData.get("id") as string;
    const fields = readPatientForm(formData);

    await db.patient.update({ where: { id: patientId }, data: fields });

    revalidatePath("/patients");
    revalidatePath(`/patients/${patientId}`);
    return "Patient updated successfully";
  });
}

// Delete a patient.
export async function deletePatientAction({ patientId }: { patientId: string }) {
  await getAdminUser();

  return runAction(async () => {
    await db.patient.delete({ where: { id: patientId } });

    revalidatePath("/patients");
    return "Patient deleted successfully";
  });
}
