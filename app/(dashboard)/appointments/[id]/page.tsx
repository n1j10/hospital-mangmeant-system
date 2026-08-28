import { fetchSingleAppointment, updateAppointmentStatusAction } from "@/utils/actions";
import { ArrowLeft, User, Stethoscope, Building2, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/global/StatusBadge";
import FormContainer from "@/components/global/FormContainer";
import SubmitButton from "@/components/global/SubmitButton";
import { formatDateTime, formatDate } from "@/utils/format";

function StatusUpdateForm({ appointmentId, newStatus, label, variant }: {
  appointmentId: string;
  newStatus: string;
  label: string;
  variant?: "default" | "destructive" | "outline";
}) {
  return (
    <FormContainer action={updateAppointmentStatusAction}>
      <input type="hidden" name="id" value={appointmentId} />
      <input type="hidden" name="status" value={newStatus} />
      <SubmitButton text={label} variant={variant ?? "outline"} size="sm" />
    </FormContainer>
  );
}

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await fetchSingleAppointment(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Appointment Details</h1>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDateTime(appointment.scheduledAt)}
          </p>
        </div>
        {/* Status Actions */}
        <div className="flex gap-2">
          {appointment.status === "PENDING" && (
            <>
              <StatusUpdateForm appointmentId={id} newStatus="CONFIRMED" label="Confirm" variant="default" />
              <StatusUpdateForm appointmentId={id} newStatus="CANCELLED" label="Cancel" variant="destructive" />
            </>
          )}
          {appointment.status === "CONFIRMED" && (
            <>
              <StatusUpdateForm appointmentId={id} newStatus="COMPLETED" label="Mark Completed" variant="default" />
              <StatusUpdateForm appointmentId={id} newStatus="CANCELLED" label="Cancel" variant="destructive" />
            </>
          )}
          {appointment.status === "COMPLETED" && !appointment.consultation && (
            <Link href={`/consultations/create?appointmentId=${id}`}>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md shadow-purple-500/20">
                <FileText className="h-4 w-4 mr-1" />
                Add Consultation
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">Patient</span>
          </div>
          <Link
            href={`/patients/${appointment.patientId}`}
            className="font-semibold text-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            {appointment.patient.fullName}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{appointment.patient.phone}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Stethoscope className="h-4 w-4" />
            <span className="text-sm font-medium">Doctor</span>
          </div>
          <Link
            href={`/doctors/${appointment.doctorId}`}
            className="font-semibold text-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            {appointment.doctor.user.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{appointment.doctor.specialization}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">Department</span>
          </div>
          <Link
            href={`/departments/${appointment.departmentId}`}
            className="font-semibold text-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            {appointment.department.name}
          </Link>
        </div>
      </div>

      {/* Reason */}
      {appointment.reason && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-2">Reason for Visit</h3>
          <p className="text-muted-foreground">{appointment.reason}</p>
        </div>
      )}

      {/* Linked Consultation */}
      {appointment.consultation && (
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
          <h3 className="font-semibold mb-2 text-purple-700 dark:text-purple-400 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Consultation Record
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            <strong>Diagnosis:</strong> {appointment.consultation.diagnosis || "Not recorded"}
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            <strong>Notes:</strong> {appointment.consultation.notes || "No notes"}
          </p>
          <Link href={`/consultations/${appointment.consultation.id}`}>
            <Button size="sm" variant="outline">View Full Consultation</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
