import { fetchExpiringMedicines } from "@/utils/actions";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/utils/format";
import EmptyList from "@/components/global/EmptyList";
import { cn } from "@/lib/utils";

export default async function ExpiringPage() {
  const medicines = await fetchExpiringMedicines();

  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pharmacy"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-red-500" />
            Expiring Medicines
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {medicines.length} medicines expiring within 30 days
          </p>
        </div>
      </div>

      {medicines.length === 0 ? (
        <EmptyList
          heading="No medicines expiring soon"
          message="All medicines are within their validity period."
        />
      ) : (
        <div className="rounded-xl border border-red-500/20 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((med) => {
                const expiry = new Date(med.expiryDate);
                const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isExpired = daysLeft <= 0;
                const isCritical = daysLeft <= 7 && daysLeft > 0;

                return (
                  <TableRow key={med.id} className={cn(isExpired ? "bg-red-500/10" : isCritical ? "bg-orange-500/5" : "bg-amber-500/5")}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell><Badge variant="secondary">{med.category.name}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{med.quantity} {med.unit || "units"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(med.expiryDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          isExpired
                            ? "text-red-600 border-red-500/30"
                            : isCritical
                              ? "text-orange-600 border-orange-500/30"
                              : "text-amber-600 border-amber-500/30"
                        )}
                      >
                        {isExpired ? "Expired" : `${daysLeft} days`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatCurrency(med.price)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
