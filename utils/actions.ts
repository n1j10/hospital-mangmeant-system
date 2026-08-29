"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import db from "./db";
import {
  loginSchema,
  registerSchema,
  departmentSchema,
  doctorSchema,
  patientSchema,
  appointmentSchema,
  consultationSchema,
  admissionSchema,
  medicineSchema,
  categorySchema,
  prescriptionItemSchema,
  validateFuctionSchema,
} from "./schema";
import { signToken, hashPassword, comparePassword, getAuthUser } from "./auth";
import type { DashboardStats, NavbarNotification } from "./type";
import type { AuthPayload } from "./auth";

// ─── helpers ──────────────────────────────────
const renderError = (error: unknown): { message: string } => {
  console.log("🔥 SERVER ACTION ERROR:", error);
  return {
    message: error instanceof Error ? error.message : "Unknown Error",
  };
};

// ═══════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════
export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(loginSchema, rawData);
    const user = await db.user.findUnique({ where: { email: validated.email } });
    if (!user) {
      console.log("❌ USER NOT FOUND FOR EMAIL:", validated.email);
      throw new Error("Invalid email or password");
    }
    if (!comparePassword(validated.password, user.password)) {
      console.log("❌ PASSWORD MISMATCH FOR USER:", validated.email);
      throw new Error("Invalid email or password");
    }
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/admin");
}

export async function registerAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(registerSchema, rawData);
    const exists = await db.user.findUnique({ where: { email: validated.email } });
    if (exists) throw new Error("Email already registered");
    await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashPassword(validated.password),
        role: validated.role as any,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/login");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}

export async function getCurrentUser() {
  return getAuthUser();
}

// ═══════════════════════════════════════════════
//  DASHBOARD STATS
// ═══════════════════════════════════════════════
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalPatients,
    totalDoctors,
    totalDepartments,
    todayAppointments,
    activeAdmissions,
    lowStockMedicines,
  ] = await Promise.all([
    db.patient.count(),
    db.doctor.count(),
    db.department.count(),
    db.appointment.count({
      where: { scheduledAt: { gte: today, lt: tomorrow } },
    }),
    db.admission.count({ where: { status: "ADMITTED" } }),
    db.medicine.count({
      where: { quantity: { lte: db.medicine.fields.lowStockThreshold } },
    }),
  ]);

  return {
    totalPatients,
    totalDoctors,
    totalDepartments,
    todayAppointments,
    activeAdmissions,
    lowStockMedicines,
  };
}

// Notifications are calculated from current operational data, so they stay
// relevant without storing duplicate notification records.
export async function fetchNavbarNotifications(
  user: AuthPayload
): Promise<NavbarNotification[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const appointmentScope =
    user.role === "DOCTOR" ? { doctor: { userId: user.userId } } : {};

  const [pendingAppointments, lowStockMedicines, expiringMedicines] =
    await Promise.all([
      db.appointment.count({
        where: {
          ...appointmentScope,
          scheduledAt: { gte: today, lt: tomorrow },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),
      db.medicine.count({
        where: { quantity: { lte: db.medicine.fields.lowStockThreshold } },
      }),
      db.medicine.count({
        where: { expiryDate: { gte: today, lte: thirtyDaysFromNow } },
      }),
    ]);

  const notifications: NavbarNotification[] = [];

  if (pendingAppointments > 0) {
    notifications.push({
      id: `appointments-${pendingAppointments}`,
      title: `${pendingAppointments} appointment${pendingAppointments === 1 ? "" : "s"} today`,
      description: "Review today’s pending and confirmed appointments.",
      href: "/appointments?status=ALL",
      type: "info",
    });
  }

  if (lowStockMedicines > 0) {
    notifications.push({
      id: `low-stock-${lowStockMedicines}`,
      title: `${lowStockMedicines} medicine${lowStockMedicines === 1 ? " needs" : "s need"} restocking`,
      description: "Stock has reached or fallen below its safety threshold.",
      href: "/pharmacy/low-stock",
      type: "warning",
    });
  }

  if (expiringMedicines > 0) {
    notifications.push({
      id: `expiring-${expiringMedicines}`,
      title: `${expiringMedicines} medicine${expiringMedicines === 1 ? " expires" : "s expire"} within 30 days`,
      description: "Check expiry dates and plan stock rotation.",
      href: "/pharmacy/expiring",
      type: "warning",
    });
  }

  return notifications;
}

// ═══════════════════════════════════════════════
//  DEPARTMENTS
// ═══════════════════════════════════════════════
export async function fetchDepartments(search?: string) {
  const departments = await db.department.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    include: { doctors: { include: { user: true } }, _count: { select: { doctors: true, appointments: true } } },
    orderBy: { createdAt: "desc" },
  });
  return departments;
}

export async function fetchSingleDepartment(id: string) {
  const department = await db.department.findUnique({
    where: { id },
    include: {
      doctors: { include: { user: true } },
      appointments: {
        include: { patient: true, doctor: { include: { user: true } } },
        orderBy: { scheduledAt: "desc" },
        take: 10,
      },
    },
  });
  if (!department) redirect("/departments");
  return department;
}

export async function createDepartmentAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(departmentSchema, rawData);
    await db.department.create({ data: validated });
    revalidatePath("/departments");
    return { message: "Department created successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function updateDepartmentAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const id = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(departmentSchema, rawData);
    await db.department.update({ where: { id }, data: validated });
    revalidatePath("/departments");
    revalidatePath(`/departments/${id}`);
    return { message: "Department updated successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteDepartmentAction(
  prevState: { departmentId: string }
): Promise<{ message: string }> {
  try {
    await db.department.delete({ where: { id: prevState.departmentId } });
    revalidatePath("/departments");
    return { message: "Department deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  DOCTORS
// ═══════════════════════════════════════════════
export async function fetchDoctors(search?: string) {
  const doctors = await db.doctor.findMany({
    where: search
      ? {
          OR: [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { specialization: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { user: true, department: true },
    orderBy: { createdAt: "desc" },
  });
  return doctors;
}

export async function fetchSingleDoctor(id: string) {
  const doctor = await db.doctor.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      appointments: {
        include: { patient: true, department: true },
        orderBy: { scheduledAt: "desc" },
        take: 20,
      },
    },
  });
  if (!doctor) redirect("/doctors");
  return doctor;
}

export async function createDoctorAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(doctorSchema, rawData);
    const existingUser = await db.user.findUnique({ where: { email: validated.email } });
    if (existingUser) throw new Error("Email already registered");
    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashPassword(validated.password),
        role: "DOCTOR",
      },
    });
    await db.doctor.create({
      data: {
        userId: user.id,
        specialization: validated.specialization,
        departmentId: validated.departmentId,
      },
    });
    revalidatePath("/doctors");
    return { message: "Doctor created successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteDoctorAction(
  prevState: { doctorId: string }
): Promise<{ message: string }> {
  try {
    const doctor = await db.doctor.findUnique({ where: { id: prevState.doctorId } });
    if (!doctor) throw new Error("Doctor not found");
    await db.doctor.delete({ where: { id: prevState.doctorId } });
    await db.user.delete({ where: { id: doctor.userId } });
    revalidatePath("/doctors");
    return { message: "Doctor deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  PATIENTS
// ═══════════════════════════════════════════════
export async function fetchPatients(search?: string) {
  const patients = await db.patient.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
  return patients;
}

export async function fetchSinglePatient(id: string) {
  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { doctor: { include: { user: true } }, department: true },
        orderBy: { scheduledAt: "desc" },
      },
      consultations: {
        include: {
          doctor: { include: { user: true } },
          prescriptions: { include: { medicine: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      admissions: {
        include: { doctor: { include: { user: true } }, department: true },
        orderBy: { admitDate: "desc" },
      },
    },
  });
  if (!patient) redirect("/patients");
  return patient;
}

export async function createPatientAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(patientSchema, rawData);
    await db.patient.create({
      data: {
        fullName: validated.fullName,
        gender: validated.gender as any,
        dateOfBirth: new Date(validated.dateOfBirth),
        phone: validated.phone,
        address: validated.address || null,
        bloodType: validated.bloodType || null,
      },
    });
    revalidatePath("/patients");
    return { message: "Patient registered successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function updatePatientAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const id = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(patientSchema, rawData);
    await db.patient.update({
      where: { id },
      data: {
        fullName: validated.fullName,
        gender: validated.gender as any,
        dateOfBirth: new Date(validated.dateOfBirth),
        phone: validated.phone,
        address: validated.address || null,
        bloodType: validated.bloodType || null,
      },
    });
    revalidatePath("/patients");
    revalidatePath(`/patients/${id}`);
    return { message: "Patient updated successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function deletePatientAction(
  prevState: { patientId: string }
): Promise<{ message: string }> {
  try {
    await db.patient.delete({ where: { id: prevState.patientId } });
    revalidatePath("/patients");
    return { message: "Patient deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  APPOINTMENTS
// ═══════════════════════════════════════════════
export async function fetchAppointments({
  search,
  status,
}: { search?: string; status?: string } = {}) {
  const appointments = await db.appointment.findMany({
    where: {
      ...(status && status !== "ALL" ? { status: status as any } : {}),
      ...(search
        ? {
            OR: [
              { patient: { fullName: { contains: search, mode: "insensitive" as const } } },
              { reason: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: {
      patient: true,
      doctor: { include: { user: true } },
      department: true,
    },
    orderBy: { scheduledAt: "desc" },
  });
  return appointments;
}

export async function fetchSingleAppointment(id: string) {
  const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: { include: { user: true } },
      department: true,
      consultation: {
        include: { prescriptions: { include: { medicine: true } } },
      },
    },
  });
  if (!appointment) redirect("/appointments");
  return appointment;
}

export async function createAppointmentAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(appointmentSchema, rawData);
    await db.appointment.create({
      data: {
        patientId: validated.patientId,
        doctorId: validated.doctorId,
        departmentId: validated.departmentId,
        scheduledAt: new Date(validated.scheduledAt),
        reason: validated.reason || null,
      },
    });
    revalidatePath("/appointments");
    return { message: "Appointment created successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function updateAppointmentStatusAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    await db.appointment.update({
      where: { id },
      data: { status: status as any },
    });
    revalidatePath("/appointments");
    revalidatePath(`/appointments/${id}`);
    return { message: `Appointment ${status.toLowerCase()} successfully` };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteAppointmentAction(
  prevState: { appointmentId: string }
): Promise<{ message: string }> {
  try {
    await db.appointment.delete({ where: { id: prevState.appointmentId } });
    revalidatePath("/appointments");
    return { message: "Appointment deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  CONSULTATIONS
// ═══════════════════════════════════════════════
export async function fetchConsultations(search?: string) {
  const consultations = await db.consultation.findMany({
    where: search
      ? {
          OR: [
            { patient: { fullName: { contains: search, mode: "insensitive" } } },
            { diagnosis: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      patient: true,
      doctor: { include: { user: true } },
      appointment: true,
      prescriptions: { include: { medicine: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return consultations;
}

export async function fetchSingleConsultation(id: string) {
  const consultation = await db.consultation.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: { include: { user: true } },
      appointment: true,
      prescriptions: { include: { medicine: true } },
    },
  });
  if (!consultation) redirect("/consultations");
  return consultation;
}

export async function createConsultationAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(consultationSchema, rawData);
    await db.consultation.create({
      data: {
        appointmentId: validated.appointmentId,
        patientId: validated.patientId,
        doctorId: validated.doctorId,
        diagnosis: validated.diagnosis || null,
        notes: validated.notes || null,
      },
    });
    // Also mark appointment as completed
    await db.appointment.update({
      where: { id: validated.appointmentId },
      data: { status: "COMPLETED" },
    });
    revalidatePath("/consultations");
    revalidatePath("/appointments");
    return { message: "Consultation created successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  ADMISSIONS
// ═══════════════════════════════════════════════
export async function fetchAdmissions({
  search,
  status,
}: { search?: string; status?: string } = {}) {
  const admissions = await db.admission.findMany({
    where: {
      ...(status && status !== "ALL" ? { status: status as any } : {}),
      ...(search
        ? { patient: { fullName: { contains: search, mode: "insensitive" as const } } }
        : {}),
    },
    include: {
      patient: true,
      doctor: { include: { user: true } },
      department: true,
    },
    orderBy: { admitDate: "desc" },
  });
  return admissions;
}

export async function fetchSingleAdmission(id: string) {
  const admission = await db.admission.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: { include: { user: true } },
      department: true,
    },
  });
  if (!admission) redirect("/admissions");
  return admission;
}

export async function createAdmissionAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(admissionSchema, rawData);
    await db.admission.create({
      data: {
        patientId: validated.patientId,
        doctorId: validated.doctorId,
        departmentId: validated.departmentId,
        reason: validated.reason || null,
      },
    });
    revalidatePath("/admissions");
    return { message: "Patient admitted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function dischargePatientAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const id = formData.get("id") as string;
    await db.admission.update({
      where: { id },
      data: { status: "DISCHARGED", dischargeDate: new Date() },
    });
    revalidatePath("/admissions");
    revalidatePath(`/admissions/${id}`);
    return { message: "Patient discharged successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  PHARMACY — Categories
// ═══════════════════════════════════════════════
export async function fetchCategories() {
  return db.medicineCategory.findMany({
    include: { _count: { select: { medicines: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createCategoryAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(categorySchema, rawData);
    await db.medicineCategory.create({ data: validated });
    revalidatePath("/pharmacy/categories");
    return { message: "Category created successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteCategoryAction(
  prevState: { categoryId: string }
): Promise<{ message: string }> {
  try {
    await db.medicineCategory.delete({ where: { id: prevState.categoryId } });
    revalidatePath("/pharmacy/categories");
    return { message: "Category deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  PHARMACY — Medicines
// ═══════════════════════════════════════════════
export async function fetchMedicines({
  search,
  categoryId,
}: { search?: string; categoryId?: string } = {}) {
  return db.medicine.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function fetchSingleMedicine(id: string) {
  const medicine = await db.medicine.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!medicine) redirect("/pharmacy");
  return medicine;
}

export async function fetchLowStockMedicines() {
  return db.medicine.findMany({
    where: { quantity: { lte: db.medicine.fields.lowStockThreshold } },
    include: { category: true },
    orderBy: { quantity: "asc" },
  });
}

export async function fetchExpiringMedicines() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return db.medicine.findMany({
    where: { expiryDate: { lte: thirtyDaysFromNow } },
    include: { category: true },
    orderBy: { expiryDate: "asc" },
  });
}

export async function createMedicineAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(medicineSchema, rawData);
    await db.medicine.create({
      data: {
        name: validated.name,
        categoryId: validated.categoryId,
        quantity: validated.quantity,
        unit: validated.unit || null,
        price: validated.price,
        expiryDate: new Date(validated.expiryDate),
        lowStockThreshold: validated.lowStockThreshold,
      },
    });
    revalidatePath("/pharmacy");
    return { message: "Medicine added successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function updateMedicineAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const id = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(medicineSchema, rawData);
    await db.medicine.update({
      where: { id },
      data: {
        name: validated.name,
        categoryId: validated.categoryId,
        quantity: validated.quantity,
        unit: validated.unit || null,
        price: validated.price,
        expiryDate: new Date(validated.expiryDate),
        lowStockThreshold: validated.lowStockThreshold,
      },
    });
    revalidatePath("/pharmacy");
    return { message: "Medicine updated successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteMedicineAction(
  prevState: { medicineId: string }
): Promise<{ message: string }> {
  try {
    await db.medicine.delete({ where: { id: prevState.medicineId } });
    revalidatePath("/pharmacy");
    return { message: "Medicine deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  PRESCRIPTIONS
// ═══════════════════════════════════════════════
export async function addPrescriptionItemAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateFuctionSchema(prescriptionItemSchema, rawData);
    await db.prescriptionItem.create({ data: validated });
    revalidatePath(`/consultations/${validated.consultationId}`);
    return { message: "Prescription item added" };
  } catch (error) {
    return renderError(error);
  }
}

export async function removePrescriptionItemAction(
  prevState: { itemId: string; consultationId: string }
): Promise<{ message: string }> {
  try {
    await db.prescriptionItem.delete({ where: { id: prevState.itemId } });
    revalidatePath(`/consultations/${prevState.consultationId}`);
    return { message: "Prescription item removed" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  USERS (admin)
// ═══════════════════════════════════════════════
export async function fetchUsers() {
  return db.user.findMany({
    include: { doctor: { include: { department: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteUserAction(
  prevState: { userId: string }
): Promise<{ message: string }> {
  try {
    await db.user.delete({ where: { id: prevState.userId } });
    revalidatePath("/admin/users");
    return { message: "User deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

// ═══════════════════════════════════════════════
//  RECENT ITEMS (for dashboard)
// ═══════════════════════════════════════════════
export async function fetchRecentAppointments() {
  return db.appointment.findMany({
    include: {
      patient: true,
      doctor: { include: { user: true } },
      department: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

// Fetch all doctors (for dropdowns)
export async function fetchAllDoctorsForSelect() {
  return db.doctor.findMany({
    include: { user: true, department: true },
    orderBy: { user: { name: "asc" } },
  });
}

// Fetch all patients (for dropdowns)
export async function fetchAllPatientsForSelect() {
  return db.patient.findMany({
    orderBy: { fullName: "asc" },
  });
}

// Fetch all departments (for dropdowns)
export async function fetchAllDepartmentsForSelect() {
  return db.department.findMany({
    orderBy: { name: "asc" },
  });
}

// Fetch completed appointments without consultation (for creating consultations)
export async function fetchCompletedAppointmentsWithoutConsultation() {
  return db.appointment.findMany({
    where: {
      status: "COMPLETED",
      consultation: null,
    },
    include: {
      patient: true,
      doctor: { include: { user: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
}
