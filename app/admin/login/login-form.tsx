"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-wasro-slate"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            autoFocus
            placeholder="••••••••"
            className="h-12 w-full rounded-pill border border-wasro-border bg-white pl-4 pr-12 text-sm text-wasro-charcoal placeholder:text-wasro-slate focus:border-wasro-blue focus:outline-none focus:ring-2 focus:ring-wasro-blue/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full text-wasro-slate transition hover:bg-wasro-cream hover:text-wasro-charcoal"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {state?.ok === false && (
        <div className="flex items-start gap-2 rounded-card bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-wasro-blue text-sm font-bold text-white shadow-md shadow-wasro-blue/25 transition hover:-translate-y-0.5 hover:bg-wasro-blue-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Signing in…
        </>
      ) : (
        <>
          <LogIn size={16} /> Sign in
        </>
      )}
    </button>
  );
}
