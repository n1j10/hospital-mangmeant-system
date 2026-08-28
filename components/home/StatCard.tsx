import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";



interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}


function StatCard({title,value,icon: Icon,description,trend,className,}: StatCardProps){
 return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-md hover:shadow-purple-500/10",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="rounded-lg bg-gradient-to-br from-purple-500/15 to-blue-500/15 p-3 border border-purple-500/20">
          <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
