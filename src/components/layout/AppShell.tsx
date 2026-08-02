import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
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
import { displayName } from "@/lib/format";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean; cashierOnly?: boolean };

function RealtimeClock() {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        hours: now.getHours() % 12,
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate rotation angles
  const secondsRotation = (time.seconds * 6);
  const minutesRotation = (time.minutes * 6) + (time.seconds * 0.1);
  const hoursRotation = (time.hours * 30) + (time.minutes * 0.5);

  // Hide on desktop, only show on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex items-center gap-6">
      {/* Analog Clock - No Background */}
      <div className="relative size-32" style={{
        perspective: "1000px",
      }}>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 bg-slate-900 rounded-full z-20 shadow-lg" />
        
        {/* Hour markers (1-12) */}
        {[...Array(12)].map((_, i) => {
          const isLarge = i % 3 === 0;
          return (
            <div
              key={i}
              className="absolute font-bold"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${i * 30}deg)`,
              }}
            >
              <div
                style={{
                  transform: `rotate(-${i * 30}deg) translateY(-48px)`,
                  fontSize: isLarge ? "20px" : "16px",
                  color: "#0f172a",
                  fontWeight: "900",
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                {i === 0 ? "12" : i}
              </div>
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          className="absolute top-1/2 left-1/2 origin-left bg-slate-900 shadow-lg rounded-full"
          style={{
            width: "6px",
            height: "40px",
            marginLeft: "3px",
            marginTop: "-20px",
            transform: `rotate(${hoursRotation}deg)`,
            transition: "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute top-1/2 left-1/2 origin-left bg-slate-800 shadow-lg rounded-full"
          style={{
            width: "5px",
            height: "52px",
            marginLeft: "2.5px",
            marginTop: "-26px",
            transform: `rotate(${minutesRotation}deg)`,
            transition: "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        />

        {/* Second hand */}
        <div
          className="absolute top-1/2 left-1/2 origin-left rounded-full"
          style={{
            width: "2px",
            height: "58px",
            marginLeft: "1px",
            marginTop: "-29px",
            background: "rgb(220, 38, 38)",
            transform: `rotate(${secondsRotation}deg)`,
            transition: "transform 0.05s linear",
            boxShadow: "0 1px 4px rgba(220, 38, 38, 0.5)",
            zIndex: 5,
          }}
        />
      </div>

      {/* Digital time display */}
      <div className="font-mono text-2xl font-bold text-slate-900">
        {String(time.hours || 12).padStart(2, "0")}:
        {String(time.minutes).padStart(2, "0")}:
        {String(time.seconds).padStart(2, "0")}
      </div>
    </div>
  );
}

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Operations",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
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
      { to: "/products", label: "Products", icon: Package, adminOnly: true },
      { to: "/categories", label: "Categories", icon: Tags, adminOnly: true },
      { to: "/inventory", label: "Inventory", icon: Boxes, adminOnly: true },
      { to: "/purchases", label: "Purchases", icon: ClipboardList, adminOnly: true },
      { to: "/suppliers", label: "Suppliers", icon: Truck, adminOnly: true },
    ],
  },
  {
    group: "Business",
    items: [
      { to: "/expenses", label: "Expenses", icon: Wallet, adminOnly: true },
      { to: "/reports", label: "Reports", icon: BarChart3, adminOnly: true },
      { to: "/staff", label: "Staff & Roles", icon: UserCog, adminOnly: true },
      { to: "/audit", label: "Audit Logs", icon: ScrollText, adminOnly: true },
      { to: "/settings", label: "Settings", icon: SettingsIcon, adminOnly: true },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { profile, roles, signOut, isManager, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const staffName = profile?.full_name?.trim() || displayName(profile?.email);
  const initials =
    staffName
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
          {NAV.map((section) => {
            // Hide entire sections if they're all admin-only for cashiers
            const visibleItems = section.items.filter((i) => {
              if (i.adminOnly) return isAdmin;
              if (i.cashierOnly) return !isAdmin;
              return true;
            });
            
            if (visibleItems.length === 0) return null;
            
            return (
              <div key={section.group}>
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {section.group}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
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
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <button 
            onClick={() => navigate({ to: "/account" })}
            className="w-full flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3 transition-all hover:bg-sidebar-accent"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/40 text-sm font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold capitalize">{staffName}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {roles[0]?.replace("_", " ") || "staff"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={async (e) => { e.stopPropagation(); await signOut(); await navigate({ to: "/auth" }); }} aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </button>
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
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-KE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <RealtimeClock />
          </div>
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
