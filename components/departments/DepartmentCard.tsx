import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CalendarClock } from "lucide-react";
import DeleteButton from "@/components/global/DeleteButton";
import { deleteDepartmentAction } from "@/utils/actions";

type DepartmentWithCounts = {
  id: string;
  name: string;
  description: string | null;
  _count: { doctors: number; appointments: number };
};

export default function DepartmentCard({
  department,
}: {
  department: DepartmentWithCounts;
}) {
  return (
    <Card className="group hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-purple-500/15 to-blue-500/15 p-2.5 border border-purple-500/20">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-base">
                <Link
                  href={`/departments/${department.id}`}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {department.name}
                </Link>
              </CardTitle>
            </div>
          </div>
          <DeleteButton
            actionFn={deleteDepartmentAction}
            id={department.id}
            idKey="departmentId"
          />
        </div>
      </CardHeader>
      <CardContent>
        {department.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {department.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{department._count.doctors} doctors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{department._count.appointments} appts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
