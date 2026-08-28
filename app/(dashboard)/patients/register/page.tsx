import FormContainer from "@/components/global/FormContainer";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormTextarea from "@/components/form/FormTextarea";
import SubmitButton from "@/components/global/SubmitButton";
import { createPatientAction } from "@/utils/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => ({
  value: b, label: b,
}));

export default function RegisterPatientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Register Patient</h1>
          <p className="text-sm text-muted-foreground mt-1">Add a new patient to the system</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <FormContainer action={createPatientAction}>
            <div className="space-y-4">
              <FormInput name="fullName" label="Full Name" placeholder="e.g. Ahmed Mohammed" required />
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  name="gender"
                  label="Gender"
                  required
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                  ]}
                  placeholder="Select gender"
                />
                <FormSelect
                  name="bloodType"
                  label="Blood Type"
                  options={bloodTypes}
                  placeholder="Select blood type"
                />
              </div>
              <FormInput name="dateOfBirth" label="Date of Birth" type="date" required />
              <FormInput name="phone" label="Phone Number" type="tel" placeholder="+964 7XX XXX XXXX" required />
              <FormTextarea name="address" label="Address" placeholder="Patient's full address..." />
              <SubmitButton text="Register Patient" />
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
