"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  checkPassword,
  isAdminConfigured,
  signSession,
} from "@/lib/admin-auth";

/**
 * Login server action. Form posts here from /admin/login.
 *
 * Returns a state object the page renders inline:
 *   - { ok: false, error: "..." } on bad credentials or misconfig
 *   - redirects to ?next (or /admin) on success — no return needed
 *
 * The state shape is compatible with React 19's `useActionState`.
 */
export type LoginState = { ok: false; error: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      ok: false,
      error:
        "Admin is not configured on the server. Set ADMIN_PASSWORD and ADMIN_SECRET env vars.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  // Defensive: only allow internal redirects so an attacker can't craft a
  // login link that bounces to an external phishing page.
  const safeNext = next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/admin";

  if (!password) {
    return { ok: false, error: "Enter the admin password." };
  }
  if (!checkPassword(password)) {
    // Small artificial delay to slow brute-force attempts on a single IP.
    await new Promise((r) => setTimeout(r, 500));
    return { ok: false, error: "That password is incorrect." };
  }

  const token = await signSession();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

  redirect(safeNext);
}
