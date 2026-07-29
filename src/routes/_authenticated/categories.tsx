import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, GlassPanel, EmptyState } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { num } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Silver Pub POS" },
      { name: "description", content: "Organise the bar menu into categories for faster cashier workflows." },
      { property: "og:title", content: "Categories — Silver Pub POS" },
      { property: "og:description", content: "Create and manage product categories for the POS grid." },
    ],
  }),
  component: CategoriesPage,
});

type Category = { id: string; name: string; description: string | null; sort_order: number };

function CategoriesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", sort_order: "0" });

  const { data, isLoading } = useQuery({
    queryKey: ["categories-page"],
    queryFn: async () => {
      const [{ data: cats }, { data: products }] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("id,category_id"),
      ]);
      const counts = new Map<string, number>();
      for (const p of (products ?? []) as { category_id: string | null }[]) {
        if (!p.category_id) continue;
        counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
      }
      return { cats: (cats ?? []) as Category[], counts };
    },
  });

  const save = async () => {
    if (!form.name.trim()) return toast.error("Category name is required");
    const { error } = await supabase.from("categories").insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    });
    if (error) return toast.error(error.message);
    toast.success("Category created");
    setForm({ name: "", description: "", sort_order: "0" });
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["categories-page"] });
  };

  const remove = async (id: string, count: number) => {
    if (count > 0) return toast.error("Move or delete the products in this category first");
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Category removed");
    void qc.invalidateQueries({ queryKey: ["categories-page"] });
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Group the menu so cashiers find drinks instantly"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 size-4" /> New category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Name</Label>
                  <Input id="cat-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Input
                    id="cat-desc"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-sort">Sort order</Label>
                  <Input
                    id="cat-sort"
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void save()}>Save category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading categories…</p>
      ) : (data?.cats.length ?? 0) === 0 ? (
        <EmptyState title="No categories" description="Create categories like Beer, Spirits or Soft Drinks." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data!.cats.map((c) => {
            const count = data!.counts.get(c.id) ?? 0;
            return (
              <GlassPanel key={c.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold">{c.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.description || "No description"}</p>
                  <p className="mt-3 text-xs uppercase tracking-widest text-primary">
                    {num(count)} product{count === 1 ? "" : "s"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${c.name}`}
                  onClick={() => void remove(c.id, count)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
}
