import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("glass-card p-5", className)}>{children}</div>;
}

function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (from.current === value) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const initial = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(initial + (value - initial) * eased);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        from.current = value;
        setDisplay(value);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
}

export function StatCard({
  label,
  value,
  format,
  icon,
  hint,
  tone = "gold",
  index = 0,
}: {
  label: string;
  value: number;
  format: (n: number) => string;
  icon?: ReactNode;
  hint?: string;
  tone?: "gold" | "success" | "info" | "warning" | "destructive";
  index?: number;
}) {
  const animated = useCountUp(value);
  const toneClass = {
    gold: "text-primary",
    success: "text-success",
    info: "text-info",
    warning: "text-warning",
    destructive: "text-destructive",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card lift p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        {icon && <span className={cn("opacity-80", toneClass)}>{icon}</span>}
      </div>
      <p className={cn("mt-3 font-display text-2xl font-semibold tabular-nums", toneClass)}>
        {format(animated)}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="glass-card grid place-items-center px-6 py-16 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
