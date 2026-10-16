"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { appointmentSchema, validateFuctionSchema } from "../schema";
import type { AppointmentStatus } from "@/lib/generated/prisma/enums";
import { getAuthUser, getAdminUser } from "./user";
import {
  runAction,
  orRedirect,
  contains,
  statusFilter,
  doctorWithUser,
  patientDoctorDepartment,
  prescriptionsWithMedicine,
} from "./helpers";

// All appointments. Optional filters: search by patient name / reason, and status.
export async function fetchAppointments({
  search,
  status,
}: {
  search?: string;
  status?: string;
} = {}) {
  await getAuthUser();

  return db.appointment.findMany({
    where: {
      status: statusFilter<AppointmentStatus>(status),
      OR: search
        ? [{ patient: { fullName: contains(search) } }, { reason: contains(search) }]
        : undefined,
    },
    include: patientDoctorDepartment,
    orderBy: { scheduledAt: "desc" },
  });
}

// One appointment (with its consultation and prescriptions).
// If it does not exist, go to the appointments page.
export async function fetchSingleAppointment(id: string) {
  await getAuthUser();

  const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      ...patientDoctorDepartment,
      consultation: { include: { prescriptions: prescriptionsWithMedicine } },
    },
  });
  return orRedirect(appointment, "/appointments");
}

// Completed appointments that still have no consultation.
export async function fetchCompletedAppointmentsWithoutConsultation() {
  await getAuthUser();

  return db.appointment.findMany({
    where: { status: "COMPLETED", consultation: null },
    include: { patient: true, doctor: doctorWithUser },
    orderBy: { scheduledAt: "desc" },
  });
}

// Create a new appointment.
export async function createAppointmentAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const fields = validateFuctionSchema(appointmentSchema, Object.fromEntries(formData));

    await db.appointment.create({
      data: {
        patientId: fields.patientId,
        doctorId: fields.doctorId,
        departmentId: fields.departmentId,
        scheduledAt: new Date(fields.scheduledAt),
        reason: fields.reason || null,
      },
    });

    revalidatePath("/appointments");
    return "Appointment created successfully";
  });
}

// Change the status of an appointment (confirm, cancel, complete...).
export async function updateAppointmentStatusAction(prevState: any, formData: FormData) {
  await getAuthUser();

  return runAction(async () => {
    const appointmentId = formData.get("id") as string;
    const status = formData.get("status") as AppointmentStatus;

    await db.appointment.update({ where: { id: appointmentId }, data: { status } });

    revalidatePath("/appointments");
    revalidatePath(`/appointments/${appointmentId}`);
    return `Appointment ${status.toLowerCase()} successfully`;
  });
}

// Delete an appointment.
export async function deleteAppointmentAction({ appointmentId }: { appointmentId: string }) {
  await getAdminUser();

  return runAction(async () => {
    await db.appointment.delete({ where: { id: appointmentId } });

    revalidatePath("/appointments");
    return "Appointment deleted successfully";
  });
}
