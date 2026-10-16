"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { admissionSchema, validateFuctionSchema } from "../schema";
import type { AdmissionStatus } from "@/lib/generated/prisma/enums";
import { getAuthUser } from "./user";
import { runAction, orRedirect, contains, statusFilter, patientDoctorDepartment } from "./helpers";

// All admissions. Optional filters: search by patient name, and status.
export async function fetchAdmissions({
  search,
  status,
}: {
  search?: string;
  status?: string;
} = {}) {
  await getAuthUser();

  return db.admission.findMany({
    where: {
      status: statusFilter<AdmissionStatus>(status),
      patient: search ? { fullName: contains(search) } : undefined,
    },
    include: patientDoctorDepartment,
    orderBy: { admitDate: "desc" },
  });
}

// One admission. If it does not exist, go to the admissions page.
export async function fetchSingleAdmission(id: string) {
  await getAuthUser();

  const admission = await db.admission.findUnique({
    where: { id },
    include: patientDoctorDepartment,
  });
  return orRedirect(admission, "/admissions");
}

// Admit a patient to the hospital.
export async function createAdmissionAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const fields = validateFuctionSchema(admissionSchema, Object.fromEntries(formData));

    await db.admission.create({
      data: {
        patientId: fields.patientId,
        doctorId: fields.doctorId,
        departmentId: fields.departmentId,
        reason: fields.reason || null,
      },
    });

    revalidatePath("/admissions");
    return "Patient admitted successfully";
  });
}

// Discharge a patient (status DISCHARGED + discharge date = now).
export async function dischargePatientAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const admissionId = formData.get("id") as string;

    await db.admission.update({
      where: { id: admissionId },
      data: { status: "DISCHARGED", dischargeDate: new Date() },
    });

    revalidatePath("/admissions");
    revalidatePath(`/admissions/${admissionId}`);
    return "Patient discharged successfully";
  });
}
