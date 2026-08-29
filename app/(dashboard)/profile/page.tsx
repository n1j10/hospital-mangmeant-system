import { LogOut, Mail, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/utils/actions";
import { getAuthUser } from "@/utils/auth";
import db from "@/utils/db";
import { formatDate } from "@/utils/format";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
};

export default async function ProfilePage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: authUser.userId },
    include: { doctor: { include: { department: true } } },
  });

  if (!user) redirect("/login");

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account and hospital-system access details.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-28 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600" />
        <div className="px-6 pb-6">
          <Avatar className="-mt-12 h-24 w-24 border-4 border-card shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-2xl font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="outline" className="w-fit border-purple-500/30 bg-purple-500/10 px-3 py-1 text-purple-700 dark:text-purple-300">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              {roleLabels[user.role] ?? user.role}
            </Badge>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold">Account information</h2>
          <dl className="space-y-4">
            <InfoRow icon={UserRound} label="Full name" value={user.name} />
            <InfoRow icon={Mail} label="Email address" value={user.email} />
            <InfoRow icon={ShieldCheck} label="System role" value={roleLabels[user.role] ?? user.role} />
          </dl>
          <form action={logoutAction} className="mt-6 border-t border-border pt-5">
            <Button type="submit" variant="destructive" className="w-full sm:w-auto">
              <LogOut />
              Sign out
            </Button>
          </form>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold">Work details</h2>
          <dl className="space-y-4">
            <InfoRow
              icon={Stethoscope}
              label="Specialization"
              value={user.doctor?.specialization ?? "Not assigned"}
            />
            <InfoRow
              icon={ShieldCheck}
              label="Department"
              value={user.doctor?.department.name ?? "Not assigned"}
            />
            <InfoRow icon={UserRound} label="Member since" value={formatDate(user.createdAt)} />
          </dl>
        </div>
      </section>
    </div>
  );
}


interface InfoRowProps {
icon: typeof UserRound;
  label: string;
  value: string;
}

function InfoRow({icon: Icon,label,value,}: InfoRowProps)  {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
