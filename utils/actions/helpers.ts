import { redirect } from "next/navigation";
import db from "../db";

// Small things that are used in more than one actions file.
// (Normal file, not a server-actions file, so it can export normal values.)

// ================= Actions helpers =================

// Turn any error into a simple { message } object that the forms can show.
export const renderError = (error: unknown): { message: string } => {
  console.log("SERVER ACTION ERROR:", error);
  return {
    message: error instanceof Error ? error.message : "Unknown Error",
  };
};

// Run the work and return { message }:
// - success: the message that the work returns.
// - error: the error message.
// (This is the try/catch we used to write in every action, written once here.)
export const runAction = async (work: () => Promise<string>) => {
  try {
    return { message: await work() };
  } catch (error) {
    return renderError(error);
  }
};

// If the item was not found (null) go to the page, otherwise return the item.
export const orRedirect = <T>(item: T | null, path: string): T => {
  if (!item) redirect(path);
  return item;
};

// ================= Prisma helpers =================

// Search text, ignoring upper/lower case (a = A).
// Usage: where: { name: search ? contains(search) : undefined }
// (A filter set to `undefined` is ignored by Prisma.)
export const contains = (text: string) =>
  ({ contains: text, mode: "insensitive" } as const);

// Status filter from a <select>: "ALL" (or empty) means no filter.
export const statusFilter = <T extends string>(status?: string) =>
  status && status !== "ALL" ? (status as T) : undefined;

// Load the doctor together with his user (name, email...).
export const doctorWithUser = { include: { user: true } } as const;

// Load the patient, the doctor (with his user) and the department.
// (Used by appointments, admissions and the dashboard.)
export const patientDoctorDepartment = {
  patient: true,
  doctor: doctorWithUser,
  department: true,
} as const;

// Load the prescription items together with their medicines.
export const prescriptionsWithMedicine = { include: { medicine: true } } as const;

// "Low stock" means: quantity <= lowStockThreshold of the same medicine.
export const lowStockFilter = {
  quantity: { lte: db.medicine.fields.lowStockThreshold },
};

// The date after X days from now.
export const getDateAfterDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
