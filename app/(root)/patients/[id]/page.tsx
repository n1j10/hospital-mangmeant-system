import { fetchSinglePatient } from "@/utils/actions";
import { ArrowLeft, Phone, MapPin, Droplets, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/global/StatusBadge";
import { formatDate, formatDateTime, formatAge, formatGender } from "@/utils/format";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await fetchSinglePatient(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{patient.fullName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Patient Profile</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-2xl font-bold shrink-0">
            {patient.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Gender:</span>
              <Badge variant="secondary">{formatGender(patient.gender)}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{formatAge(patient.dateOfBirth)} years ({formatDate(patient.dateOfBirth)})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{patient.phone}</span>
            </div>
            {patient.bloodType && (
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">Blood Type:</span>
                <Badge variant="outline" className="font-mono text-red-600 dark:text-red-400 border-red-500/25">
                  {patient.bloodType}
                </Badge>
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium">{patient.address}</span>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <Link href={`/appointments/create?patientId=${patient.id}`}>
              <Button size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs: Appointments | Consultations | Admissions */}
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">
            Appointments ({patient.appointments.length})
          </TabsTrigger>
          <TabsTrigger value="consultations">
            Consultations ({patient.consultations.length})
          </TabsTrigger>
          <TabsTrigger value="admissions">
            Admissions ({patient.admissions.length})
          </TabsTrigger>
        </TabsList>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">
                      <Link href={`/appointments/${apt.id}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        {apt.doctor.user.name}
                      </Link>
                    </TableCell>
                    <TableCell>{apt.department.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDateTime(apt.scheduledAt)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{apt.reason || "—"}</TableCell>
                    <TableCell><StatusBadge status={apt.status} /></TableCell>
                  </TableRow>
                ))}
                {patient.appointments.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No appointments</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Consultations Tab */}
        <TabsContent value="consultations">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Prescriptions</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.consultations.map((con) => (
                  <TableRow key={con.id}>
                    <TableCell className="font-medium">
                      <Link href={`/consultations/${con.id}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        {con.doctor.user.name}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{con.diagnosis || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{con.prescriptions.length} items</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(con.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {patient.consultations.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No consultations</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Admissions Tab */}
        <TabsContent value="admissions">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Admit Date</TableHead>
                  <TableHead>Discharge Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.admissions.map((adm) => (
                  <TableRow key={adm.id}>
                    <TableCell className="font-medium">{adm.doctor.user.name}</TableCell>
                    <TableCell>{adm.department.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(adm.admitDate)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {adm.dischargeDate ? formatDate(adm.dischargeDate) : "—"}
                    </TableCell>
                    <TableCell><StatusBadge status={adm.status} /></TableCell>
                  </TableRow>
                ))}
                {patient.admissions.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No admissions</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}