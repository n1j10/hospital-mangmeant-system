import { fetchDoctors } from "@/utils/actions";
import SearchInput from "@/components/global/SearchInput";
import EmptyList from "@/components/global/EmptyList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Stethoscope, Mail } from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteButton from "@/components/global/DeleteButton";
import { deleteDoctorAction } from "@/utils/actions";

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const doctors = await fetchDoctors(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctors</h1>
          <p className="text-sm text-muted-foreground mt-1">{doctors.length} doctors registered</p>
        </div>
        <Link href="/doctors/create">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md shadow-purple-500/20">
            <Plus className="h-4 w-4 mr-1" />
            Add Doctor
          </Button>
        </Link>
      </div>

      <Suspense>
        <SearchInput placeholder="Search by name or specialization..." />
      </Suspense>

      {doctors.length === 0 ? (
        <EmptyList heading="No doctors found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="group hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-xs">
                      {doctor.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        <Link href={`/doctors/${doctor.id}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {doctor.user.name}
                        </Link>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />
                        {doctor.user.email}
                      </p>
                    </div>
                  </div>
                  <DeleteButton actionFn={deleteDoctorAction} id={doctor.id} idKey="doctorId" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{doctor.specialization}</Badge>
                  <Badge variant="outline" className="text-purple-700 dark:text-purple-400 border-purple-500/25">
                    {doctor.department.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}