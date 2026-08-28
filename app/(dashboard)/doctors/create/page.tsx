import FormContainer from "@/components/global/FormContainer";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import SubmitButton from "@/components/global/SubmitButton";
import { createDoctorAction, fetchAllDepartmentsForSelect } from "@/utils/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateDoctorPage() {
  const departments = await fetchAllDepartmentsForSelect();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doctors"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Doctor</h1>
          <p className="text-sm text-muted-foreground mt-1">Register a new doctor in the system</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <FormContainer action={createDoctorAction}>
            <div className="space-y-4">
              <FormInput name="name" label="Full Name" placeholder="Dr. John Smith" required />
              <FormInput name="email" label="Email" type="email" placeholder="john@hospital.com" required />
              <FormInput name="password" label="Password" type="password" placeholder="••••••••" required />
              <FormInput name="specialization" label="Specialization" placeholder="e.g. Cardiologist" required />
              <FormSelect
                name="departmentId"
                label="Department"
                required
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                placeholder="Select department"
              />
              <SubmitButton text="Add Doctor" />
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
