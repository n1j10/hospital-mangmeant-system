"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { doctorSchema, validateFuctionSchema } from "../schema";
import { hashPassword } from "../auth";
import { getAuthUser, getAdminUser } from "./user";
import { runAction, orRedirect, contains } from "./helpers";

// Load the doctor with his user and department.
const doctorInclude = { user: true, department: true } as const;

// All doctors. Optional filter: search by name or specialization.
export async function fetchDoctors(search?: string) {
  await getAuthUser();

  return db.doctor.findMany({
    where: {
      OR: search
        ? [{ user: { name: contains(search) } }, { specialization: contains(search) }]
        : undefined,
    },
    include: doctorInclude,
    orderBy: { createdAt: "desc" },
  });
}

// One doctor (with his latest 20 appointments).
// If he does not exist, go to the doctors page.
export async function fetchSingleDoctor(id: string) {
  await getAuthUser();

  const doctor = await db.doctor.findUnique({
    where: { id },
    include: {
      ...doctorInclude,
      appointments: {
        include: { patient: true, department: true },
        orderBy: { scheduledAt: "desc" },
        take: 20,
      },
    },
  });
  return orRedirect(doctor, "/doctors");
}

// All doctors for the <select> dropdowns.
export async function fetchAllDoctorsForSelect() {
  await getAuthUser();

  return db.doctor.findMany({
    include: doctorInclude,
    orderBy: { user: { name: "asc" } },
  });
}

// Create a new doctor (a user with the DOCTOR role + his doctor profile).
export async function createDoctorAction(prevState: any, formData: FormData) {
  await getAdminUser();

  return runAction(async () => {
    const fields = validateFuctionSchema(doctorSchema, Object.fromEntries(formData));

    const emailUsed = await db.user.findUnique({ where: { email: fields.email } });
    if (emailUsed) throw new Error("Email already registered");

    // Create the user and his doctor profile in ONE query
    await db.user.create({
      data: {
        name: fields.name,
        email: fields.email,
        password: hashPassword(fields.password),
        role: "DOCTOR",
        doctor: {
          create: {
            specialization: fields.specialization,
            departmentId: fields.departmentId,
          },
        },
      },
    });

    revalidatePath("/doctors");
    return "Doctor created successfully";
  });
}

// Delete a doctor.
export async function deleteDoctorAction({ doctorId }: { doctorId: string }) {
  await getAdminUser();

  return runAction(async () => {
    const doctor = await db.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new Error("Doctor not found");

    // Deleting the user also deletes the doctor profile (onDelete: Cascade)
    await db.user.delete({ where: { id: doctor.userId } });

    revalidatePath("/doctors");
    return "Doctor deleted successfully";
  });
}
