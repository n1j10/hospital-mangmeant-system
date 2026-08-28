import { fetchSingleAdmission, dischargePatientAction } from "@/utils/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormContainer from "@/components/global/FormContainer";
import SubmitButton from "@/components/global/SubmitButton";
import { formatDate, formatDateTime } from "@/utils/format";

export default async function DischargePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admission = await fetchSingleAdmission(id);

  if (admission.status === "DISCHARGED") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admissions"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Patient Already Discharged</h1>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-muted-foreground">
            {admission.patient.fullName} was discharged on {admission.dischargeDate ? formatDate(admission.dischargeDate) : "unknown date"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admissions"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Discharge Patient</h1>
          <p className="text-sm text-muted-foreground mt-1">Process discharge for {admission.patient.fullName}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="max-w-2xl space-y-4">
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <h3 className="font-semibold">Admission Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Patient</p>
              <p className="font-medium">{admission.patient.fullName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Doctor</p>
              <p className="font-medium">{admission.doctor.user.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-medium">{admission.department.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Admit Date</p>
              <p className="font-medium">{formatDate(admission.admitDate)}</p>
            </div>
          </div>
          {admission.reason && (
            <div>
              <p className="text-muted-foreground text-sm">Reason</p>
              <p className="text-sm">{admission.reason}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-3">Confirm Discharge</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This will mark the patient as discharged and record today's date as the discharge date.
          </p>
          <FormContainer action={dischargePatientAction}>
            <input type="hidden" name="id" value={admission.id} />
            <SubmitButton
              text="Confirm Discharge"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            />
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
