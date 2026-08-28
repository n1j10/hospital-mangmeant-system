import FormContainer from "@/components/global/FormContainer";
import FormInput from "@/components/form/FormInput";
import FormTextarea from "@/components/form/FormTextarea";
import SubmitButton from "@/components/global/SubmitButton";
import { createDepartmentAction } from "@/utils/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateDepartmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/departments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Department</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new hospital department</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <FormContainer action={createDepartmentAction}>
            <div className="space-y-4">
              <FormInput name="name" label="Department Name" placeholder="e.g. Cardiology" required />
              <FormTextarea name="description" label="Description" placeholder="Brief description of the department..." />
              <SubmitButton text="Create Department" />
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
