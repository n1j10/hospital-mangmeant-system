import { fetchLowStockMedicines } from "@/utils/actions";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import EmptyList from "@/components/global/EmptyList";

export default async function LowStockPage() {
  const medicines = await fetchLowStockMedicines();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pharmacy"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Low Stock Medicines
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {medicines.length} medicines need restocking
          </p>
        </div>
      </div>

      {medicines.length === 0 ? (
        <EmptyList
          heading="No low stock medicines"
          message="All medicines are sufficiently stocked."
        />
      ) : (
        <div className="rounded-xl border border-amber-500/20 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((med) => (
                <TableRow key={med.id} className="bg-amber-500/5 hover:bg-amber-500/10">
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell><Badge variant="secondary">{med.category.name}</Badge></TableCell>
                  <TableCell>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {med.quantity} {med.unit || "units"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{med.lowStockThreshold}</TableCell>
                  <TableCell className="text-muted-foreground">{formatCurrency(med.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                      Restock Needed
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
