import { fetchUsers, deleteUserAction } from "@/utils/actions";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/components/global/DeleteButton";
import { formatDate } from "@/utils/format";

const roleColors: Record<string, string> = {
  ADMIN: "bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-400",
  DOCTOR: "bg-teal-500/15 text-teal-700 border-teal-500/25 dark:text-teal-400",
  RECEPTIONIST: "bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400",
};

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {users.length} registered users
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-semibold shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColors[user.role] ?? ""}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.doctor?.department?.name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <DeleteButton actionFn={deleteUserAction} id={user.id} idKey="userId" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
