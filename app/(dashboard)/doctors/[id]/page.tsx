import { fetchSingleDoctor } from "@/utils/actions";
import { ArrowLeft, Mail, Building2, CalendarClock, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/global/StatusBadge";
import { formatDateTime, formatDate } from "@/utils/format";

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await fetchSingleDoctor(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doctors"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{doctor.user.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Doctor Profile</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xl font-bold shadow-md shadow-purple-500/20">
            {doctor.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> {doctor.user.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" /> {doctor.department.name}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary"><Stethoscope className="h-3 w-3 mr-1" />{doctor.specialization}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-purple-600 dark:text-purple-400" /> Appointments
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctor.appointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell className="font-medium">
                  <Link href={`/patients/${apt.patient.id}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{apt.patient.fullName}</Link>
                </TableCell>
                <TableCell>{apt.department.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDateTime(apt.scheduledAt)}</TableCell>
                <TableCell><StatusBadge status={apt.status} /></TableCell>
              </TableRow>
            ))}
            {doctor.appointments.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No appointments</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}