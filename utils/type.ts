import { Prisma } from "@/lib/generated/prisma/client";

export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>;

// Doctor with user + department relations
export type DoctorWithRelations = Prisma.DoctorGetPayload<{
  include: { user: true; department: true };
}>;

// Patient (standalone – no relations needed for list)
export type PatientBasic = Prisma.PatientGetPayload<{}>;

// Appointment with all relations
export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { patient: true; doctor: { include: { user: true } }; department: true };
}>;

// Consultation with relations
export type ConsultationWithRelations = Prisma.ConsultationGetPayload<{
  include: {
    patient: true;
    doctor: { include: { user: true } };
    appointment: true;
    prescriptions: { include: { medicine: true } };
  };
}>;

// Admission with relations
export type AdmissionWithRelations = Prisma.AdmissionGetPayload<{
  include: { patient: true; doctor: { include: { user: true } }; department: true };
}>;

// Medicine with category
export type MedicineWithCategory = Prisma.MedicineGetPayload<{
  include: { category: true };
}>;

// PrescriptionItem with medicine
export type PrescriptionItemWithMedicine = Prisma.PrescriptionItemGetPayload<{
  include: { medicine: true };
}>;

// Patient with full history
export type PatientWithHistory = Prisma.PatientGetPayload<{
  include: {
    appointments: { include: { doctor: { include: { user: true } }; department: true } };
    consultations: { include: { doctor: { include: { user: true } } } };
    admissions: { include: { doctor: { include: { user: true } }; department: true } };
  };
}>;

// Doctor with full details
export type DoctorWithDetails = Prisma.DoctorGetPayload<{
  include: {
    user: true;
    department: true;
    appointments: { include: { patient: true } };
  };
}>;

// Dashboard stats shape
export type DashboardStats = {
  totalPatients: number;
  totalDoctors: number;
  totalDepartments: number;
  todayAppointments: number;
  activeAdmissions: number;
  lowStockMedicines: number;
};

export type NavbarNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "warning" | "info" | "success";
};
