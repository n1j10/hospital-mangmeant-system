"use server";
import db from "../db";
import type { DashboardStats, NavbarNotification } from "../type";
import type { AuthPayload } from "../auth";
import { getAuthUser } from "./user";
import { patientDoctorDepartment, lowStockFilter, getDateAfterDays } from "./helpers";

// The start of today and the start of tomorrow.
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

// The numbers shown in the dashboard cards.
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await getAuthUser();
  const { start, end } = getTodayRange();

  // Run all the counts at the same time (faster)
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
    db.appointment.count({ where: { scheduledAt: { gte: start, lt: end } } }),
    db.admission.count({ where: { status: "ADMITTED" } }),
    db.medicine.count({ where: lowStockFilter }),
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

// Notifications are calculated from the current data (nothing is saved in DB).
export async function fetchNavbarNotifications(
  user: AuthPayload,
): Promise<NavbarNotification[]> {
  const { start, end } = getTodayRange();

  // A doctor sees only his own appointments, other roles see all
  const appointmentScope =
    user.role === "DOCTOR" ? { doctor: { userId: user.userId } } : {};

  const [todayAppointments, lowStockMedicines, expiringMedicines] = await Promise.all([
    db.appointment.count({
      where: {
        ...appointmentScope,
        scheduledAt: { gte: start, lt: end },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
    db.medicine.count({ where: lowStockFilter }),
    db.medicine.count({
      where: { expiryDate: { gte: start, lte: getDateAfterDays(30) } },
    }),
  ]);

  const notifications: NavbarNotification[] = [];

  if (todayAppointments > 0) {
    notifications.push({
      id: `appointments-${todayAppointments}`,
      title: `${todayAppointments} appointment(s) today`,
      description: "Review today's pending and confirmed appointments.",
      href: "/appointments?status=ALL",
      type: "info",
    });
  }

  if (lowStockMedicines > 0) {
    notifications.push({
      id: `low-stock-${lowStockMedicines}`,
      title: `${lowStockMedicines} medicine(s) need restocking`,
      description: "Stock has reached or fallen below its safety threshold.",
      href: "/pharmacy/low-stock",
      type: "warning",
    });
  }

  if (expiringMedicines > 0) {
    notifications.push({
      id: `expiring-${expiringMedicines}`,
      title: `${expiringMedicines} medicine(s) expire within 30 days`,
      description: "Check expiry dates and plan stock rotation.",
      href: "/pharmacy/expiring",
      type: "warning",
    });
  }

  return notifications;
}

// The latest 5 appointments (for the dashboard).
export async function fetchRecentAppointments() {
  await getAuthUser();

  return db.appointment.findMany({
    include: patientDoctorDepartment,
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}
