"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, CheckCheck, CircleAlert, Info } from "lucide-react";
import DarkMode from "@/components/navbar/DarkMode";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { AuthPayload } from "@/utils/auth";
import type { NavbarNotification } from "@/utils/type";

export default function Navbar({
  user,
  notifications,
}: {
  user: AuthPayload | null;
  notifications: NavbarNotification[];
}) {
  const router = useRouter();
  const storageKey = `hospital-read-notifications:${user?.userId ?? "guest"}`;
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setReadNotificationIds(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !readNotificationIds.includes(notification.id)),
    [notifications, readNotificationIds]
  );

  const saveReadNotifications = (ids: string[]) => {
    setReadNotificationIds(ids);
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
  };

  const markAsRead = (id: string) => {
    if (!readNotificationIds.includes(id)) {
      saveReadNotifications([...readNotificationIds, id]);
    }
  };

  const markAllAsRead = () => {
    saveReadNotifications([...new Set([...readNotificationIds, ...notifications.map((item) => item.id)])]);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6">
      {/* Left — Title */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Hospital Management System
        </h2>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        <DarkMode />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`Notifications${unreadNotifications.length ? `, ${unreadNotifications.length} unread` : ""}`}
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-w-4 h-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white ring-2 ring-card">
                    {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
                  </span>
                )}
              </Button>
            }
          />
          <DropdownMenuContent className="w-96 max-w-[calc(100vw-2rem)] p-0" align="end">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  {unreadNotifications.length ? `${unreadNotifications.length} unread alert${unreadNotifications.length === 1 ? "" : "s"}` : "You are all caught up"}
                </p>
              </div>
              {unreadNotifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-purple-700 dark:text-purple-300">
                  <CheckCheck className="mr-1 h-3.5 w-3.5" />
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto p-1.5">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No operational alerts right now.
                </div>
              ) : (
                notifications.map((notification) => {
                  const unread = !readNotificationIds.includes(notification.id);
                  const Icon = notification.type === "warning" ? CircleAlert : Info;

                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className="items-start gap-3 px-3 py-3 cursor-pointer"
                      onClick={() => {
                        markAsRead(notification.id);
                        router.push(notification.href);
                      }}
                    >
                      <span className={`mt-0.5 rounded-full p-1.5 ${notification.type === "warning" ? "bg-amber-500/15 text-amber-600" : "bg-blue-500/15 text-blue-600"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-medium">{notification.title}</span>
                          {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-purple-600" aria-label="Unread" />}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground whitespace-normal">{notification.description}</span>
                      </span>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/profile" aria-label="Open profile" className="rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
