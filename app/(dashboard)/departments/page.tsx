import { fetchDepartments } from "@/utils/actions";
import SearchInput from "@/components/global/SearchInput";
import EmptyList from "@/components/global/EmptyList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Users, CalendarClock } from "lucide-react";
import { Suspense } from "react";
import DepartmentCard from "@/components/departments/DepartmentCard";

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const departments = await fetchDepartments(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage hospital departments
          </p>
        </div>
        <Link href="/departments/create">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md shadow-purple-500/20">
            <Plus className="h-4 w-4 mr-1" />
            Add Department
          </Button>
        </Link>
      </div>

      <Suspense>
        <SearchInput placeholder="Search departments..." />
      </Suspense>

      {departments.length === 0 ? (
        <EmptyList heading="No departments found" message="Create your first department to get started." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      )}
    </div>
  );
}
