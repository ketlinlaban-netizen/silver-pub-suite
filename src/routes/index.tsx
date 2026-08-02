import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    // No loading page - redirect immediately to dashboard
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth" });
    }
    // Everyone goes to dashboard (no role checking)
    throw redirect({ to: "/dashboard" });
  },
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
  component: () => null,
});
