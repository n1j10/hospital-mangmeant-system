"use server";
import { redirect } from "next/navigation";
import { getAuthUser as getSessionUser } from "../auth";

// Get the logged-in user. If nobody is logged in, go to the login page.
export const getAuthUser = async () => {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
};

// Same as getAuthUser, but only the admin can pass.
export const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") redirect("/");
  return user;
};
