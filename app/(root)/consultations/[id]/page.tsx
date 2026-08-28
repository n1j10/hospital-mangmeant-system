import {
  fetchSingleConsultation,
  addPrescriptionItemAction,
  removePrescriptionItemAction,
  fetchMedicines,
} from "@/utils/actions";
import { ArrowLeft, Pill, User, Stethoscope, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import FormContainer from "@/components/global/FormContainer";
import FormSelect from "@/components/form/FormSelect";
import FormInput from "@/components/form/FormInput";
import SubmitButton from "@/components/global/SubmitButton";
import { formatDate } from "@/utils/format";

export default async function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [consultation, medicines] = await Promise.all([
    fetchSingleConsultation(id),
    fetchMedicines(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/consultations"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultation Details</h1>
          <p className="text-sm text-muted-foreground mt-1">{formatDate(consultation.createdAt)}</p>
        </div>
      </div>

      {/* Patient & Doctor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <User className="h-4 w-4" /><span className="text-sm font-medium">Patient</span>
          </div>
          <Link href={`/patients/${consultation.patientId}`} className="font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            {consultation.patient.fullName}
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Stethoscope className="h-4 w-4" /><span className="text-sm font-medium">Doctor</span>
          </div>
          <Link href={`/doctors/${consultation.doctorId}`} className="font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            {consultation.doctor.user.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">{consultation.doctor.specialization}</p>
        </div>
      </div>

      {/* Diagnosis & Notes */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />Clinical Record
        </h3>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</p>
          <p className="text-foreground">{consultation.diagnosis || "Not recorded"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
          <p className="text-foreground whitespace-pre-line">{consultation.notes || "No notes"}</p>
        </div>
      </div>

      {/* Prescriptions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 pb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Prescriptions ({consultation.prescriptions.length})
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultation.prescriptions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.medicine.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.medicine.unit || "—"}</Badge>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{item.dosage || "—"}</TableCell>
                <TableCell>
                  <form action={async () => {
                    "use server";
                    const { removePrescriptionItemAction } = await import("@/utils/actions");
                    await removePrescriptionItemAction({ itemId: item.id, consultationId: consultation.id });
                  }}>
                    <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {consultation.prescriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No prescriptions yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Add Prescription */}
        <div className="p-6 pt-4 border-t border-border">
          <p className="text-sm font-medium mb-3">Add Prescription Item</p>
          <FormContainer action={addPrescriptionItemAction}>
            <input type="hidden" name="consultationId" value={consultation.id} />
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <FormSelect
                  name="medicineId"
                  label="Medicine"
                  required
                  options={medicines.map((m) => ({
                    value: m.id,
                    label: `${m.name} (${m.quantity} ${m.unit || "units"} in stock)`,
                  }))}
                  placeholder="Select medicine"
                />
              </div>
              <div className="w-24">
                <FormInput name="quantity" label="Qty" type="number" defaultValue="1" required />
              </div>
              <div className="flex-1 min-w-[150px]">
                <FormInput name="dosage" label="Dosage" placeholder="e.g. 1 tablet twice daily" />
              </div>
              <div className="flex items-end">
                <SubmitButton text="Add" size="sm" />
              </div>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
