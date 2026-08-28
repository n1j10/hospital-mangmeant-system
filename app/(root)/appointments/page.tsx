import { fetchAppointments } from "@/utils/actions";
import SearchInput from "@/components/global/SearchInput";
import EmptyList from "@/components/global/EmptyList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/global/StatusBadge";
import DeleteButton from "@/components/global/DeleteButton";
import { deleteAppointmentAction } from "@/utils/actions";
import { formatDateTime } from "@/utils/format";

const statuses = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { search, status } = await searchParams;
  const appointments = await fetchAppointments({ search, status });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {appointments.length} appointments found
          </p>
        </div>
        <Link href="/appointments/create">
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
            <Plus className="h-4 w-4 mr-1" />
            New Appointment
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Suspense>
          <SearchInput placeholder="Search by patient or reason..." />
        </Suspense>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/appointments?status=${s}`}
              className={`inline-flex h-9 items-center rounded-lg border px-3 text-xs font-medium transition-colors ${
                (status ?? "ALL") === s
                  ? "bg-teal-500 text-white border-teal-500"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {appointments.length === 0 ? (
        <EmptyList heading="No appointments found" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/appointments/${apt.id}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                      {apt.patient.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{apt.doctor.user.name}</TableCell>
                  <TableCell>{apt.department.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {formatDateTime(apt.scheduledAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                    {apt.reason || "—"}
                  </TableCell>
                  <TableCell><StatusBadge status={apt.status} /></TableCell>
                  <TableCell>
                    <DeleteButton actionFn={deleteAppointmentAction} id={apt.id} idKey="appointmentId" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
