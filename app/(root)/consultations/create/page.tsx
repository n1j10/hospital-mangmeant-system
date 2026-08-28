import {
  fetchCompletedAppointmentsWithoutConsultation,
  createConsultationAction,
} from "@/utils/actions";
import FormContainer from "@/components/global/FormContainer";
import FormSelect from "@/components/form/FormSelect";
import FormTextarea from "@/components/form/FormTextarea";
import SubmitButton from "@/components/global/SubmitButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/format";

export default async function CreateConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId?: string }>;
}) {
  const { appointmentId } = await searchParams;
  const appointments = await fetchCompletedAppointmentsWithoutConsultation();

  const selectedAppointment = appointments.find((a) => a.id === appointmentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/consultations">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Consultation</h1>
          <p className="text-sm text-muted-foreground mt-1">Record a consultation for a completed appointment</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <FormContainer action={createConsultationAction}>
            <div className="space-y-4">
              <FormSelect
                name="appointmentId"
                label="Appointment"
                required
                defaultValue={appointmentId}
                options={appointments.map((a) => ({
                  value: a.id,
                  label: `${a.patient.fullName} — ${a.doctor.user.name} (${formatDateTime(a.scheduledAt)})`,
                }))}
                placeholder="Select completed appointment"
              />
              {/* Hidden fields auto-populated from appointment */}
              {selectedAppointment && (
                <>
                  <input type="hidden" name="patientId" value={selectedAppointment.patientId} />
                  <input type="hidden" name="doctorId" value={selectedAppointment.doctorId} />
                </>
              )}
              {!selectedAppointment && (
                <>
                  <input type="hidden" name="patientId" value="" />
                  <input type="hidden" name="doctorId" value="" />
                </>
              )}
              <FormTextarea name="diagnosis" label="Diagnosis" placeholder="Enter diagnosis details..." rows={3} />
              <FormTextarea name="notes" label="Clinical Notes" placeholder="Additional notes, observations, or instructions..." rows={4} />
              <SubmitButton text="Save Consultation" />
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
