"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { getAdminUser } from "./user";
import { runAction } from "./helpers";

// All users for the admin page (newest first).
export async function fetchUsers() {
  await getAdminUser();

  return db.user.findMany({
    include: {
      doctor: {
        include: {
          department: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

// Delete a user (if he is a doctor, his doctor profile is deleted too).
export async function deleteUserAction({ userId }: { userId: string }) {
  await getAdminUser();

  return runAction(async () => {
    await db.user.delete({
      where: {
        id: userId
      }
    });

    revalidatePath("/admin/users");
    return "User deleted successfully";
  });
}
