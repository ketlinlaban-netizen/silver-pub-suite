import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Silver Pub POS — Enterprise Bar Management" },
      {
        name: "description",
        content:
          "Silver Pub POS: lightning-fast cashier workflows, running tabs, dispensing reconciliation, inventory and executive analytics for bars.",
      },
      { property: "og:title", content: "Silver Pub POS — Enterprise Bar Management" },
      {
        property: "og:description",
        content:
          "Cloud point of sale built for pubs, bars and lounges — tabs, shifts, dispensing and reporting in one premium suite.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { loading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    void navigate({ to: session ? "/dashboard" : "/auth", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl gold-surface font-display text-2xl font-bold">
          SP
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold gold-text">SILVER PUB</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          POS &amp; Bar Management
        </p>
        <div className="mx-auto mt-8 h-1 w-40 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
