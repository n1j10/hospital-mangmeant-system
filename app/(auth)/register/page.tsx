"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import FormContainer from "@/components/global/FormContainer";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import SubmitButton from "@/components/global/SubmitButton";
import { registerAction } from "@/utils/actions";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative text-center text-white px-12">
          <Activity className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Join MediCare</h2>
          <p className="text-purple-100 text-lg max-w-md mx-auto leading-relaxed">
            Create your account and start managing your hospital with powerful,
            modern tools.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">MediCare</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register to access the hospital management system
          </p>

          <div className="mt-8">
            <FormContainer action={registerAction}>
              <div className="space-y-4">
                <FormInput
                  name="name"
                  label="Full Name"
                  placeholder="Dr. John Smith"
                  required
                />
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@hospital.com"
                  required
                />
                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                <FormSelect
                  name="role"
                  label="Role"
                  required
                  options={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "RECEPTIONIST", label: "Receptionist" },
                    { value: "DOCTOR", label: "Doctor" },
                  ]}
                  placeholder="Select your role"
                />
                <SubmitButton text="Create Account" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md shadow-purple-500/20" />
              </div>
            </FormContainer>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}