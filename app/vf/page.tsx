import { isAdminSession } from "@/lib/analytics/auth";
import { type RangeKey } from "@/lib/analytics/config";
import { Dashboard } from "./dashboard";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseRange(value: string | string[] | undefined): RangeKey {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "1d" || raw === "30d" || raw === "all") return raw;
  return "7d";
}

export default async function AdminPage({ searchParams }: PageProps<"/vf">) {
  const params = await searchParams;
  if (!(await isAdminSession())) {
    const err = Array.isArray(params.e) ? params.e[0] : params.e;
    return <LoginForm error={err} />;
  }
  return <Dashboard range={parseRange(params.r)} />;
}
