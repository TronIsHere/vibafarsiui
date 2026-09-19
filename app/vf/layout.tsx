import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "آمار · وایب‌فارسی",
  path: "/vf",
  index: false,
});

export default function AdminLayout({ children }: LayoutProps<"/vf">) {
  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col bg-background">
      {children}
    </div>
  );
}
