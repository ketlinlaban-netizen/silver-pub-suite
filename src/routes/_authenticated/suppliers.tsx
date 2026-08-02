import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { requireAdmin } from "@/lib/auth-guards";
import { PageHeader, GlassPanel, EmptyState, StatCard } from "@/components/ui/premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { money, num } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/suppliers")({
  beforeLoad: requireAdmin,
  head: () => ({
    meta: [
      { title: "Suppliers — Silver Pub POS" },
      { name: "description", content: "Supplier directory with contacts and outstanding balances." },
      { property: "og:title", content: "Suppliers — Silver Pub POS" },
      { property: "og:description", content: "Track who supplies the bar and what you still owe them." },
    ],
  }),
  component: SuppliersPage,
});

type Supplier = {
  id: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  products_supplied: string | null;
  outstanding_balance: number;
};

const EMPTY = {
  company_name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  products_supplied: "",
};

function SuppliersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data } = await supabase.from("suppliers").select("*").order("company_name");
      return (data ?? []) as Supplier[];
    },
  });

  const suppliers = data ?? [];
  const owed = suppliers.reduce((a, s) => a + Number(s.outstanding_balance ?? 0), 0);

  const save = async () => {
    if (!form.company_name.trim()) return toast.error("Company name is required");
    const { error } = await supabase.from("suppliers").insert({
      company_name: form.company_name.trim(),
      contact_person: form.contact_person.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      products_supplied: form.products_supplied.trim() || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Supplier added");
    setForm(EMPTY);
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["suppliers"] });
  };

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle="Contacts, delivery partners and payables"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 size-4" /> New supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add supplier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="s-company">Company name</Label>
                  <Input
                    id="s-company"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-contact">Contact person</Label>
                    <Input
                      id="s-contact"
                      value={form.contact_person}
                      onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-phone">Phone</Label>
                    <Input
                      id="s-phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-email">Email</Label>
                  <Input
                    id="s-email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-products">Products supplied</Label>
                  <Textarea
                    id="s-products"
                    value={form.products_supplied}
                    onChange={(e) => setForm({ ...form, products_supplied: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void save()}>Save supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Suppliers" value={suppliers.length} format={(n) => num(n)} icon={<Truck className="size-4" />} />
        <StatCard label="Total payable" value={owed} format={money} tone="warning" index={1} />
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading suppliers…</p>
      ) : suppliers.length === 0 ? (
        <EmptyState title="No suppliers yet" description="Add the distributors that stock your bar." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((s) => (
            <GlassPanel key={s.id}>
              <p className="font-display text-lg font-semibold">{s.company_name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.contact_person || "No contact person"}</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>{s.phone || "—"}</p>
                <p className="truncate">{s.products_supplied || "Products not specified"}</p>
              </div>
              <p className="mt-4 text-sm font-semibold text-warning">
                Balance: {money(s.outstanding_balance)}
              </p>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
