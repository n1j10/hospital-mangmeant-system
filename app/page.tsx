import Link from "next/link";
import { Activity, ArrowRight, Shield, Users, Calendar, Pill, Stethoscope, BedDouble, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Patient Management",
    description: "Register, track, and manage patient records with complete medical history.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Stethoscope,
    title: "Doctor Management",
    description: "Organize doctors by department and specialization with scheduling.",
    color: "from-teal-500 to-emerald-600",
  },
  {
    icon: Calendar,
    title: "Appointments",
    description: "Schedule, confirm, and track appointments with real-time status updates.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: ClipboardList,
    title: "Consultations",
    description: "Record diagnoses, notes, and prescriptions for each consultation.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: BedDouble,
    title: "Admissions",
    description: "Manage patient admissions and discharges with department tracking.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "Full inventory management with low-stock alerts and expiry tracking.",
    color: "from-cyan-500 to-sky-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">MediCare</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm text-teal-700 dark:text-teal-400 mb-8">
              <Shield className="h-3.5 w-3.5" />
              <span>Secure & Reliable Healthcare Management</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Modern Hospital
              <br />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Streamline your hospital operations with our comprehensive
              management system. Handle patients, doctors, appointments,
              pharmacy, and more — all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white text-base px-8 h-12"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base px-8 h-12">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete suite of tools designed for modern healthcare facilities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "256-bit", label: "Encryption" },
              { value: "24/7", label: "Support" },
              { value: "HIPAA", label: "Compliant" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-teal-500 to-cyan-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Transform Your Hospital?
          </h2>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            Join healthcare facilities already using MediCare to streamline their
            operations.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-teal-50 text-base px-8 h-12 font-semibold"
              >
                Start Now — It's Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-500" />
              <span className="text-sm font-semibold">MediCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MediCare Hospital System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
