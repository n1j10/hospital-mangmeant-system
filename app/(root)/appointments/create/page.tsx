import {
  fetchAllPatientsForSelect,
  fetchAllDoctorsForSelect,
  fetchAllDepartmentsForSelect,
  createAppointmentAction,
} from "@/utils/actions";
import FormContainer from "@/components/global/FormContainer";
import FormSelect from "@/components/form/FormSelect";
import FormInput from "@/components/form/FormInput";
import FormTextarea from "@/components/form/FormTextarea";
import SubmitButton from "@/components/global/SubmitButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  const { patientId } = await searchParams;
  const [patients, doctors, departments] = await Promise.all([
    fetchAllPatientsForSelect(),
    fetchAllDoctorsForSelect(),
    fetchAllDepartmentsForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Appointment</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule a new appointment</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <FormContainer action={createAppointmentAction}>
            <div className="space-y-4">
              <FormSelect
                name="patientId"
                label="Patient"
                required
                defaultValue={patientId}
                options={patients.map((p) => ({ value: p.id, label: p.fullName }))}
                placeholder="Select patient"
              />
              <FormSelect
                name="doctorId"
                label="Doctor"
                required
                options={doctors.map((d) => ({
                  value: d.id,
                  label: `${d.user.name} — ${d.specialization}`,
                }))}
                placeholder="Select doctor"
              />
              <FormSelect
                name="departmentId"
                label="Department"
                required
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                placeholder="Select department"
              />
              <FormInput
                name="scheduledAt"
                label="Scheduled Date & Time"
                type="datetime-local"
                required
              />
              <FormTextarea
                name="reason"
                label="Reason for Visit"
                placeholder="Brief description of the reason for this appointment..."
                rows={3}
              />
              <SubmitButton text="Create Appointment" />
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
