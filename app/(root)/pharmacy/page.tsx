import { fetchMedicines, fetchCategories } from "@/utils/actions";
import SearchInput from "@/components/global/SearchInput";
import EmptyList from "@/components/global/EmptyList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle } from "lucide-react";
import { Suspense } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/components/global/DeleteButton";
import { deleteMedicineAction } from "@/utils/actions";
import { formatDate, formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

export default async function PharmacyPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoryId?: string }>;
}) {
  const { search, categoryId } = await searchParams;
  const [medicines, categories] = await Promise.all([
    fetchMedicines({ search, categoryId }),
    fetchCategories(),
  ]);

  const lowStockCount = medicines.filter((m) => m.quantity <= m.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {medicines.length} medicines in inventory
            {lowStockCount > 0 && (
              <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                · {lowStockCount} low stock
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/pharmacy/low-stock">
            <Button variant="outline" size="sm" className="text-amber-600 border-amber-500/30">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Low Stock ({lowStockCount})
            </Button>
          </Link>
          <Link href="/pharmacy/add">
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add Medicine
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Suspense>
          <SearchInput placeholder="Search medicines..." />
        </Suspense>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/pharmacy"
            className={`inline-flex h-9 items-center rounded-lg border px-3 text-xs font-medium transition-colors ${!categoryId ? "bg-teal-500 text-white border-teal-500" : "border-border text-muted-foreground hover:bg-accent"
              }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/pharmacy?categoryId=${cat.id}`}
              className={`inline-flex h-9 items-center rounded-lg border px-3 text-xs font-medium transition-colors ${categoryId === cat.id ? "bg-teal-500 text-white border-teal-500" : "border-border text-muted-foreground hover:bg-accent"
                }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link href="/pharmacy/categories"><Button variant="outline" size="sm">Manage Categories</Button></Link>
        <Link href="/pharmacy/expiring"><Button variant="outline" size="sm">Expiring Soon</Button></Link>
      </div>

      {medicines.length === 0 ? (
        <EmptyList heading="No medicines found" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((med) => {
                const isLowStock = med.quantity <= med.lowStockThreshold;
                return (
                  <TableRow key={med.id} className={cn("hover:bg-muted/50", isLowStock && "bg-amber-500/5")}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {med.name}
                        {isLowStock && (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-xs">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{med.category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn("font-medium", isLowStock ? "text-amber-600 dark:text-amber-400" : "")}>
                        {med.quantity} {med.unit || "units"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatCurrency(med.price)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(med.expiryDate)}</TableCell>
                    <TableCell>
                      <DeleteButton actionFn={deleteMedicineAction} id={med.id} idKey="medicineId" />
                    </TableCell>
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
