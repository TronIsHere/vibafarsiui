export const INSTALL = "npx vibefarsi add button";

export const CODE_BUTTON = `
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<"button"> & {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export function Button({
  className, variant = "default", size = "md",
  loading, children, ...props
}: Props) {
  return (
    <button
      dir="rtl"
      disabled={loading || props.disabled}
      className={cn(
        "inline-flex items-center gap-2 font-semibold",
        "transition active:scale-[0.98]",
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  )
}
`;

export const PROMPT_BUTTON = `Build a React + Tailwind CSS component named "Button" (button).

This item requires:
• Variants default, secondary, outline, ghost, destructive and sizes sm/md/lg.
• Icons sit next to the label with gap-2; directional icons flip in RTL.
• Loading spinner and a disabled state.

Persian / RTL rules for all output:
• RTL layout with dir="rtl". Use logical properties (ms/me/ps/pe/start/end), never left/right.
• Font from the project (IRANSans or Vazirmatn). Never apply letter-spacing on Persian text.
• Visible numbers use Persian digits (۰–۹).
• Colors only from theme tokens. Do not invent colors.
• All visible UI copy is Persian (Farsi). Code identifiers stay English.

Output: button.tsx in TypeScript plus a short usage example.`;

export const MCP_CONFIG = `
{
  "mcpServers": {
    "vibefarsi": {
      "command": "npx",
      "args": ["-y", "@vibefarsi/mcp"]
    }
  }
}
`;

export const COMPONENT_NAMES = ["Button", "Input", "Dialog", "Select", "Toast", "Calendar"] as const;

export const FEATURES = [
  {
    id: "visual",
    title: "ظاهر یکدست",
    body: "رنگ، شعاع گوشه، سایه و فاصله از توکن می‌آیند تا اپ شلخته به‌نظر نرسد.",
  },
  {
    id: "rtl",
    title: "راست‌چین واقعی",
    body: "آیکون‌ها، انیمیشن‌ها و فاصله‌ها از پایه راست‌چین‌اند؛ یک dir روی کل صفحه کافی نیست.",
  },
  {
    id: "type",
    title: "تایپ و فاصله‌ی فارسی",
    body: "وزن فونت و ارتفاع خط برای فارسی تنظیم شده؛ letter-spacing حروف را از هم جدا نمی‌کند.",
  },
  {
    id: "nums",
    title: "اعداد و تاریخ فارسی",
    body: "ارقام فارسی، جداکننده‌ی هزارگان، تومان و تقویم شمسی داخل خود قطعه‌ها هستند.",
  },
  {
    id: "prompt",
    title: "کد یا پرامپت",
    body: "هر قطعه دو خروجی دارد: کد آماده‌ی کپی، و پرامپتی که به ابزار هوش مصنوعی می‌دهید.",
  },
  {
    id: "mcp",
    title: "سرور MCP",
    body: "قوانین طراحی فارسی، مستقیم داخل Cursor، Claude Code یا Windsurf.",
  },
] as const;

export function promptFor(name: string) {
  return PROMPT_BUTTON.replaceAll("Button", name);
}
