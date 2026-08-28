import { fetchPatients } from "@/utils/actions";
import SearchInput from "@/components/global/SearchInput";
import EmptyList from "@/components/global/EmptyList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Users, Phone, Calendar } from "lucide-react";
import { Suspense } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "@/components/global/DeleteButton";
import { deletePatientAction } from "@/utils/actions";
import { formatDate, formatAge, formatGender } from "@/utils/format";

export default async function PatientsPage({searchParams,}: {searchParams: Promise<{ search?: string }>;}) {
  
  const { search } = await searchParams;
  const patients = await fetchPatients(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {patients.length} patients registered
          </p>
        </div>
        <Link href="/patients/register">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md shadow-purple-500/20">
            <Plus className="h-4 w-4 mr-1" />
            Register Patient
          </Button>
        </Link>
      </div>

      <Suspense>
        <SearchInput placeholder="Search by name or phone..." />
      </Suspense>

      {patients.length === 0 ? (
        <EmptyList heading="No patients found" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {patient.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={patient.gender === "MALE" ? "secondary" : "outline"}>
                      {formatGender(patient.gender)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatAge(patient.dateOfBirth)} yrs
                  </TableCell>
                  <TableCell>
                    {patient.bloodType ? (
                      <Badge variant="outline" className="font-mono text-purple-700 dark:text-purple-400 border-purple-500/25">
                        {patient.bloodType}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {patient.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(patient.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      actionFn={deletePatientAction}
                      id={patient.id}
                      idKey="patientId"
                    />
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
