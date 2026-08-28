import {
  fetchAllPatientsForSelect,
  fetchAllDoctorsForSelect,
  fetchAllDepartmentsForSelect,
  createAdmissionAction,
} from "@/utils/actions";
import FormContainer from "@/components/global/FormContainer";
import FormSelect from "@/components/form/FormSelect";
import FormTextarea from "@/components/form/FormTextarea";
import SubmitButton from "@/components/global/SubmitButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateAdmissionPage() {
  const [patients, doctors, departments] = await Promise.all([
    fetchAllPatientsForSelect(),
    fetchAllDoctorsForSelect(),
    fetchAllDepartmentsForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admissions"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admit Patient</h1>
          <p className="text-sm text-muted-foreground mt-1">Register a new patient admission</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <FormContainer action={createAdmissionAction}>
            <div className="space-y-4">
              <FormSelect
                name="patientId"
                label="Patient"
                required
                options={patients.map((p) => ({ value: p.id, label: p.fullName }))}
                placeholder="Select patient"
              />
              <FormSelect
                name="doctorId"
                label="Attending Doctor"
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
              <FormTextarea name="reason" label="Reason for Admission" placeholder="Describe the reason for admission..." rows={3} />
              <SubmitButton text="Admit Patient" />
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
