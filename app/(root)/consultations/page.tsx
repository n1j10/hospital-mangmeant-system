import { fetchConsultations } from "@/utils/actions";
import SearchInput from "@/components/global/SearchInput";
import EmptyList from "@/components/global/EmptyList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/format";

export default async function ConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const consultations = await fetchConsultations(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {consultations.length} consultations recorded
          </p>
        </div>
        <Link href="/consultations/create">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md shadow-purple-500/20">
            <Plus className="h-4 w-4 mr-1" />
            New Consultation
          </Button>
        </Link>
      </div>

      <Suspense>
        <SearchInput placeholder="Search by patient or diagnosis..." />
      </Suspense>

      {consultations.length === 0 ? (
        <EmptyList heading="No consultations found" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Prescriptions</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((con) => (
                <TableRow key={con.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/consultations/${con.id}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {con.patient.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{con.doctor.user.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                    {con.diagnosis || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{con.prescriptions.length} items</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(con.createdAt)}
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
