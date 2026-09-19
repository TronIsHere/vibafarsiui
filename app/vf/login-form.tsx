import { Logo } from "@/components/shared/logo";
import { login } from "@/lib/analytics/actions";
import { isAdminConfigured } from "@/lib/analytics/auth";

export function LoginForm({
  error,
}: {
  error?: string;
}) {
  const configured = isAdminConfigured();
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-lg font-bold">آمار سایت</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            این صفحه در منو نیست. فقط با رمز وارد شوید.
          </p>
          {!configured ? (
            <p className="mt-4 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
              پنل هنوز فعال نیست. متغیر <span dir="ltr">ADMIN_PASSWORD</span> را روی سرور تنظیم کنید.
            </p>
          ) : (
            <form action={login} className="mt-5 space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">رمز</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  dir="ltr"
                  className="h-10 w-full rounded-lg border border-input bg-background/60 px-3 text-sm outline-none transition-colors focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring/60"
                />
              </label>
              {error === "1" && (
                <p className="text-sm text-destructive">رمز نادرست است.</p>
              )}
              <button
                type="submit"
                className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                ورود
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
