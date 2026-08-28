"use client";

import { LogOut, Bell, User } from "lucide-react";
import DarkMode from "@/components/navbar/DarkMode";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/utils/actions";

export default function Navbar({
  user,
}: {
  user: { name: string; email: string; role: string } | null;
}) {
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

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {user?.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => logoutAction()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
