import { fetchCategories, createMedicineAction } from "@/utils/actions";
import FormContainer from "@/components/global/FormContainer";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import SubmitButton from "@/components/global/SubmitButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AddMedicinePage() {
  const categories = await fetchCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pharmacy"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Medicine</h1>
          <p className="text-sm text-muted-foreground mt-1">Add a new medicine to inventory</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <FormContainer action={createMedicineAction}>
            <div className="space-y-4">
              <FormInput name="name" label="Medicine Name" placeholder="e.g. Amoxicillin 500mg" required />
              <FormSelect
                name="categoryId"
                label="Category"
                required
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Select category"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput name="quantity" label="Quantity in Stock" type="number" defaultValue="0" required />
                <FormInput name="unit" label="Unit" placeholder="e.g. tablets, vials, ml" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput name="price" label="Price (IQD)" type="number" defaultValue="0" required />
                <FormInput name="lowStockThreshold" label="Low Stock Alert Threshold" type="number" defaultValue="10" required />
              </div>
              <FormInput name="expiryDate" label="Expiry Date" type="date" required />
              <SubmitButton text="Add Medicine" />
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
