import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/global/StatusBadge";
import { formatDateTime } from "@/utils/format";
import type { AppointmentWithRelations } from "@/utils/type";
import Link from "next/link";

function RecentAppointments({
  appointments,
}: {
  appointments: AppointmentWithRelations[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Appointments
        </h3>
        <p className="text-sm text-muted-foreground">
          Latest appointment activity
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((apt) => (
            <TableRow key={apt.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/patients/${apt.patientId}`}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {apt.patient.fullName}
                </Link>
              </TableCell>
              <TableCell>{apt.doctor.user.name}</TableCell>
              <TableCell>{apt.department.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(apt.scheduledAt)}
              </TableCell>
              <TableCell>
                <StatusBadge status={apt.status} />
              </TableCell>
            </TableRow>
          ))}
          {appointments.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No recent appointments
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default RecentAppointments;
