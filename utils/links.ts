import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  CalendarClock,
  ClipboardList,
  BedDouble,
  Pill,
  type LucideIcon,
} from "lucide-react";

type NavLink = {
  href: string;
  name: string;
  icon: LucideIcon;
};

export const sidebarLinks: NavLink[] = [
  { href: "/admin", name: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", name: "Patients", icon: Users },
  { href: "/doctors", name: "Doctors", icon: Stethoscope },
  { href: "/departments", name: "Departments", icon: Building2 },
  { href: "/appointments", name: "Appointments", icon: CalendarClock },
  { href: "/consultations", name: "Consultations", icon: ClipboardList },
  { href: "/admissions", name: "Admissions", icon: BedDouble },
  { href: "/pharmacy", name: "Pharmacy", icon: Pill },
];

export const pharmacySubLinks: NavLink[] = [
  { href: "/pharmacy", name: "All Medicines", icon: Pill },
  { href: "/pharmacy/add", name: "Add Medicine", icon: Pill },
  { href: "/pharmacy/categories", name: "Categories", icon: Pill },
  { href: "/pharmacy/low-stock", name: "Low Stock", icon: Pill },
  { href: "/pharmacy/expiring", name: "Expiring Soon", icon: Pill },
];
