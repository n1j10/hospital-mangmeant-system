import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ADMITTED" | "DISCHARGED";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400" },
  ADMITTED: { label: "Admitted", className: "bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-400" },
  DISCHARGED: { label: "Discharged", className: "bg-slate-500/15 text-slate-700 border-slate-500/25 dark:text-slate-400" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as StatusType] || {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
