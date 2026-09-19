"use server";

import { redirect } from "next/navigation";
import { ADMIN_PATH } from "./config";
import { clearAdminCookie, isAdminConfigured, passwordMatches, setAdminCookie } from "./auth";

export async function login(formData: FormData) {
  if (!isAdminConfigured()) {
    redirect(`${ADMIN_PATH}?e=setup`);
  }
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    redirect(`${ADMIN_PATH}?e=1`);
  }
  await setAdminCookie();
  redirect(ADMIN_PATH);
}

export async function logout() {
  await clearAdminCookie();
  redirect(ADMIN_PATH);
}
