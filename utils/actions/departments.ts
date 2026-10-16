"use server";
import { revalidatePath } from "next/cache";
import db from "../db";
import { departmentSchema, validateFuctionSchema } from "../schema";
import { getAuthUser, getAdminUser } from "./user";
import { runAction, orRedirect, contains, doctorWithUser } from "./helpers";

// All departments. Optional filter: search by name.
export async function fetchDepartments(search?: string) {
  await getAuthUser();

  return db.department.findMany({
    where: { name: search ? contains(search) : undefined },
    include: {
      doctors: doctorWithUser,
      _count: { select: { doctors: true, appointments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// One department (with its doctors and latest 10 appointments).
// If it does not exist, go to the departments page.
export async function fetchSingleDepartment(id: string) {
  await getAuthUser();

  const department = await db.department.findUnique({
    where: { id },
    include: {
      doctors: doctorWithUser,
      appointments: {
        include: { patient: true, doctor: doctorWithUser },
        orderBy: { scheduledAt: "desc" },
        take: 10,
      },
    },
  });
  return orRedirect(department, "/departments");
}

// All departments for the <select> dropdowns.
export async function fetchAllDepartmentsForSelect() {
  await getAuthUser();

  return db.department.findMany({ orderBy: { name: "asc" } });
}

// Create a new department.
export async function createDepartmentAction(prevState: any, formData: FormData) {
  await getAdminUser();

  return runAction(async () => {
    const fields = validateFuctionSchema(departmentSchema, Object.fromEntries(formData));

    await db.department.create({ data: fields });

    revalidatePath("/departments");
    return "Department created successfully";
  });
}

// Update a department.
export async function updateDepartmentAction(prevState: any, formData: FormData) {
  await getAdminUser();

  return runAction(async () => {
    const departmentId = formData.get("id") as string;
    const fields = validateFuctionSchema(departmentSchema, Object.fromEntries(formData));

    await db.department.update({ where: { id: departmentId }, data: fields });

    revalidatePath("/departments");
    revalidatePath(`/departments/${departmentId}`);
    return "Department updated successfully";
  });
}

// Delete a department.
export async function deleteDepartmentAction({ departmentId }: { departmentId: string }) {
  await getAdminUser();

  return runAction(async () => {
    await db.department.delete({ where: { id: departmentId } });

    revalidatePath("/departments");
    return "Department deleted successfully";
  });
}
