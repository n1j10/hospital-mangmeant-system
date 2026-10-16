"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import db from "../db";
import { loginSchema, registerSchema, validateFuctionSchema } from "../schema";
import {
  signToken,
  hashPassword,
  comparePassword,
  getAuthUser as getSessionUser,
} from "../auth";
import type { Role } from "@/lib/generated/prisma/enums";
import { renderError } from "./helpers";

// ================= Actions =================

// Check the email and password, then save the token in a cookie.
export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  try {
    const data = validateFuctionSchema(loginSchema, Object.fromEntries(formData));

    // Find the user by email
    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error("Invalid email or password");

    // Check the password
    if (!comparePassword(data.password, user.password)) {
      throw new Error("Invalid email or password");
    }

    // Create a token and save it in a cookie (valid for 7 days)
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error) {
    return renderError(error);
  }

  // redirect must stay outside try/catch
  redirect("/admin");
}

// Create a new account, then go to the login page.
export async function registerAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  try {
    const data = validateFuctionSchema(registerSchema, Object.fromEntries(formData));

    const emailUsed = await db.user.findUnique({ where: { email: data.email } });
    if (emailUsed) throw new Error("Email already registered");

    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword(data.password),
        role: data.role as Role,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  redirect("/login");
}

// Remove the cookie and go to the login page.
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}

// ================= Read =================

// The logged-in user (or null) - used by the navbar.
export async function getCurrentUser() {
  return getSessionUser();
}
