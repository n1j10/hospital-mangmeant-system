"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/utils/links";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-r border-border bg-card flex flex-col transition-all duration-300 ease-in-out z-30",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/20">
          <Activity className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              MediCare
            </span>
            <span className="text-[11px] text-muted-foreground">
              Hospital System
            </span>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-gradient-to-r from-purple-500/15 to-blue-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25 font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-purple-600 dark:text-purple-400")} />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
