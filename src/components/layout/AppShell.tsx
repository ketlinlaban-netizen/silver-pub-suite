import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  ReceiptText,
  Users,
  Package,
  Tags,
  Boxes,
  Truck,
  ClipboardList,
  Beer,
  Wallet,
  UserCog,
  BarChart3,
  Clock3,
  Settings as SettingsIcon,
  ScrollText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; managerOnly?: boolean };

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Operations",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/pos", label: "Cashier POS", icon: ShoppingCart },
      { to: "/tabs", label: "Running Bills", icon: ReceiptText },
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/shifts", label: "Shifts", icon: Clock3 },
      { to: "/dispensing", label: "Dispensing", icon: Beer },
    ],
  },
  {
    group: "Stock",
    items: [
      { to: "/products", label: "Products", icon: Package },
      { to: "/categories", label: "Categories", icon: Tags },
      { to: "/inventory", label: "Inventory", icon: Boxes },
      { to: "/purchases", label: "Purchases", icon: ClipboardList },
      { to: "/suppliers", label: "Suppliers", icon: Truck },
    ],
  },
  {
    group: "Business",
    items: [
      { to: "/expenses", label: "Expenses", icon: Wallet },
      { to: "/reports", label: "Reports", icon: BarChart3 },
      { to: "/staff", label: "Staff & Roles", icon: UserCog, managerOnly: true },
      { to: "/audit", label: "Audit Logs", icon: ScrollText },
      { to: "/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, roles, signOut, isManager } = useAuth();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const initials =
    (profile?.full_name || profile?.email || "SP")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SP";

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      <aside
        className={cn(
          "hide-print fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="grid size-11 place-items-center rounded-2xl gold-surface font-display text-lg font-bold">
            SP
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold gold-text">SILVER PUB</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              POS &amp; Bar Suite
            </p>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {NAV.map((section) => (
            <div key={section.group}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {section.group}
              </p>
              <div className="space-y-1">
                {section.items
                  .filter((i) => !i.managerOnly || isManager)
                  .map((item) => {
                    const active = path.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)]"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-[18px] transition-colors",
                            active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                          )}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/40 text-sm font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{profile?.full_name || "Staff"}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {roles[0]?.replace("_", " ") || "staff"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => void signOut()} aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex min-h-screen flex-col">
        <header className="hide-print sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-KE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/pos">
              <Button size="sm" className="rounded-full">
                <ShoppingCart className="mr-1 size-4" /> Open POS
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
