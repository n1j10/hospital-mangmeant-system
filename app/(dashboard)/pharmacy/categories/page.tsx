import {
  fetchCategories,
  createCategoryAction,
  deleteCategoryAction,
} from "@/utils/actions";
import { ArrowLeft, Pill } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FormContainer from "@/components/global/FormContainer";
import FormInput from "@/components/form/FormInput";
import SubmitButton from "@/components/global/SubmitButton";
import DeleteButton from "@/components/global/DeleteButton";

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pharmacy"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medicine Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage pharmacy categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Category Form */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Add New Category</h3>
          <FormContainer action={createCategoryAction}>
            <div className="space-y-4">
              <FormInput name="name" label="Category Name" placeholder="e.g. Antibiotics" required />
              <SubmitButton text="Add Category" />
            </div>
          </FormContainer>
        </div>

        {/* Categories List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-5 pb-3">
            <h3 className="font-semibold">{categories.length} Categories</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <Pill className="h-3 w-3 mr-1" />
                      {cat._count.medicines} medicines
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DeleteButton actionFn={deleteCategoryAction} id={cat.id} idKey="categoryId" />
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No categories yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
