import { fetchAdmissions } from "@/utils/actions";
import SearchInput from "@/components/global/SearchInput";
import EmptyList from "@/components/global/EmptyList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/global/StatusBadge";
import { formatDate } from "@/utils/format";

const statuses = ["ALL", "ADMITTED", "DISCHARGED"];

export default async function AdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { search, status } = await searchParams;
  const admissions = await fetchAdmissions({ search, status });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {admissions.filter((a) => a.status === "ADMITTED").length} currently admitted
          </p>
        </div>
        <Link href="/admissions/create">
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
            <Plus className="h-4 w-4 mr-1" />
            Admit Patient
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Suspense>
          <SearchInput placeholder="Search by patient name..." />
        </Suspense>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/admissions?status=${s}`}
              className={`inline-flex h-9 items-center rounded-lg border px-3 text-xs font-medium transition-colors ${
                (status ?? "ALL") === s
                  ? "bg-teal-500 text-white border-teal-500"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {admissions.length === 0 ? (
        <EmptyList heading="No admissions found" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Admit Date</TableHead>
                <TableHead>Discharge Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissions.map((adm) => (
                <TableRow key={adm.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/admissions/${adm.id}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                      {adm.patient.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{adm.doctor.user.name}</TableCell>
                  <TableCell>{adm.department.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(adm.admitDate)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {adm.dischargeDate ? formatDate(adm.dischargeDate) : "—"}
                  </TableCell>
                  <TableCell><StatusBadge status={adm.status} /></TableCell>
                  <TableCell>
                    {adm.status === "ADMITTED" && (
                      <Link href={`/admissions/${adm.id}/discharge`}>
                        <Button size="sm" variant="outline" className="text-xs">Discharge</Button>
                      </Link>
                    )}
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
