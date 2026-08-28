import { Users, Stethoscope, Building2, CalendarClock, BedDouble, Pill } from "lucide-react";
import StatCard from "@/components/home/StatCard";
import RecentAppointments from "@/components/home/RecentAppointments";
import { fetchDashboardStats, fetchRecentAppointments } from "@/utils/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminDashboardPage() {
  const [stats, recentAppointments] = await Promise.all([
    fetchDashboardStats(),
    fetchRecentAppointments(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your hospital operations
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/patients/register">
            <Button size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              New Patient
            </Button>
          </Link>
          <Link href="/appointments/create">
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Patients" value={stats.totalPatients} icon={Users} />
        <StatCard title="Doctors" value={stats.totalDoctors} icon={Stethoscope} />
        <StatCard title="Departments" value={stats.totalDepartments} icon={Building2} />
        <StatCard title="Today's Appts" value={stats.todayAppointments} icon={CalendarClock} />
        <StatCard title="Admitted" value={stats.activeAdmissions} icon={BedDouble} />
        <StatCard title="Low Stock" value={stats.lowStockMedicines} icon={Pill} />
      </div>

      {/* Recent Appointments */}
      <RecentAppointments appointments={recentAppointments} />
    </div>
  );
}
