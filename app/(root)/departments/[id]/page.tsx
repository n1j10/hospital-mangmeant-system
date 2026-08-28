import { fetchSingleDepartment } from "@/utils/actions";
import { ArrowLeft, Stethoscope, CalendarClock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/global/StatusBadge";
import { formatDateTime } from "@/utils/format";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const department = await fetchSingleDepartment(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/departments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{department.name}</h1>
          {department.description && (
            <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
          )}
        </div>
      </div>

      {/* Doctors List */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              Doctors
            </h3>
            <p className="text-sm text-muted-foreground">
              {department.doctors.length} doctors in this department
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {department.doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {doctor.user.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{doctor.user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{doctor.specialization}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {department.doctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No doctors in this department
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Recent Appointments */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Recent Appointments
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {department.appointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell className="font-medium">{apt.patient.fullName}</TableCell>
                <TableCell>{apt.doctor.user.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDateTime(apt.scheduledAt)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={apt.status} />
                </TableCell>
              </TableRow>
            ))}
            {department.appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No recent appointments
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
