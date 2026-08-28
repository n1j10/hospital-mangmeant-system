import * as zod from "zod";

// ─────────────────────────────────────────────
// Generic validator (same pattern as Food-Menu)
// ─────────────────────────────────────────────
export function validateFuctionSchema<T>(schema: zod.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues ? result.error.issues.map((e) => e.message) : (result.error as any).errors?.map((e: any) => e.message) || [result.error.message];
    throw new Error(errors.join(", "));
  }
  return result.data;
}

// ─────────────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────────────
export const loginSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = zod.object({
  name: zod.string().min(2, { message: "Name must be at least 2 characters" }),
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(6, { message: "Password must be at least 6 characters" }),
  role: zod.enum(["ADMIN", "RECEPTIONIST", "DOCTOR"], {
    message: "Please select a valid role",
  }),
});

// ─────────────────────────────────────────────
// Department
// ─────────────────────────────────────────────
export const departmentSchema = zod.object({
  name: zod.string().min(2, { message: "Department name must be at least 2 characters" }),
  description: zod.string().optional(),
});

// ─────────────────────────────────────────────
// Doctor
// ─────────────────────────────────────────────
export const doctorSchema = zod.object({
  name: zod.string().min(2, { message: "Name must be at least 2 characters" }),
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(6, { message: "Password must be at least 6 characters" }),
  specialization: zod.string().min(2, { message: "Specialization is required" }),
  departmentId: zod.string().min(1, { message: "Please select a department" }),
});

// ─────────────────────────────────────────────
// Patient
// ─────────────────────────────────────────────
export const patientSchema = zod.object({
  fullName: zod.string().min(2, { message: "Full name must be at least 2 characters" }),
  gender: zod.enum(["MALE", "FEMALE"], { message: "Please select a gender" }),
  dateOfBirth: zod.string().min(1, { message: "Date of birth is required" }),
  phone: zod.string().min(7, { message: "Phone number must be at least 7 digits" }),
  address: zod.string().optional(),
  bloodType: zod.string().optional(),
});

// ─────────────────────────────────────────────
// Appointment
// ─────────────────────────────────────────────
export const appointmentSchema = zod.object({
  patientId: zod.string().min(1, { message: "Please select a patient" }),
  doctorId: zod.string().min(1, { message: "Please select a doctor" }),
  departmentId: zod.string().min(1, { message: "Please select a department" }),
  scheduledAt: zod.string().min(1, { message: "Scheduled date/time is required" }),
  reason: zod.string().optional(),
});

// ─────────────────────────────────────────────
// Consultation
// ─────────────────────────────────────────────
export const consultationSchema = zod.object({
  appointmentId: zod.string().min(1, { message: "Appointment is required" }),
  patientId: zod.string().min(1, { message: "Patient is required" }),
  doctorId: zod.string().min(1, { message: "Doctor is required" }),
  diagnosis: zod.string().optional(),
  notes: zod.string().optional(),
});

// ─────────────────────────────────────────────
// Admission
// ─────────────────────────────────────────────
export const admissionSchema = zod.object({
  patientId: zod.string().min(1, { message: "Please select a patient" }),
  doctorId: zod.string().min(1, { message: "Please select a doctor" }),
  departmentId: zod.string().min(1, { message: "Please select a department" }),
  reason: zod.string().optional(),
});

// ─────────────────────────────────────────────
// Medicine
// ─────────────────────────────────────────────
export const medicineSchema = zod.object({
  name: zod.string().min(2, { message: "Medicine name is required" }),
  categoryId: zod.string().min(1, { message: "Please select a category" }),
  quantity: zod.coerce.number().int().min(0, { message: "Quantity must be 0 or more" }),
  unit: zod.string().optional(),
  price: zod.coerce.number().min(0, { message: "Price must be a positive number" }),
  expiryDate: zod.string().min(1, { message: "Expiry date is required" }),
  lowStockThreshold: zod.coerce.number().int().min(0).default(10),
});

// ─────────────────────────────────────────────
// Medicine Category
// ─────────────────────────────────────────────
export const categorySchema = zod.object({
  name: zod.string().min(2, { message: "Category name is required" }),
});

// ─────────────────────────────────────────────
// Prescription Item
// ─────────────────────────────────────────────
export const prescriptionItemSchema = zod.object({
  consultationId: zod.string().min(1, { message: "Consultation is required" }),
  medicineId: zod.string().min(1, { message: "Please select a medicine" }),
  quantity: zod.coerce.number().int().min(1, { message: "Quantity must be at least 1" }),
  dosage: zod.string().optional(),
});
