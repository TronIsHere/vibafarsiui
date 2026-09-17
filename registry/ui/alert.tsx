import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "success" | "warning" | "destructive";

const styles: Record<Variant, { box: string; icon: React.ComponentType<{ className?: string }>; iconColor: string }> = {
  info: { box: "border-border bg-card", icon: Info, iconColor: "text-foreground" },
  success: { box: "border-success/25 bg-success/10", icon: CheckCircle2, iconColor: "text-success" },
  warning: { box: "border-warning/25 bg-warning/10", icon: AlertTriangle, iconColor: "text-warning" },
  destructive: { box: "border-destructive/30 bg-destructive/10", icon: AlertCircle, iconColor: "text-destructive" },
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: Variant;
  title?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

/** هشدار درون‌صفحه‌ای. Icon at the inline-start; use `role="alert"` for errors that need announcing. */
export function Alert({ variant = "info", title, icon, className, children, ...props }: AlertProps) {
  const s = styles[variant];
  const Icon = icon ?? s.icon;
  return (
    <div role={variant === "destructive" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", s.box, className)} {...props}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", s.iconColor)} />
      <div className="min-w-0">
        {title && <p className={cn("font-semibold", variant !== "info" && s.iconColor)}>{title}</p>}
        {children && <div className={cn("text-foreground/80", title && "mt-0.5")}>{children}</div>}
      </div>
    </div>
  );
}
