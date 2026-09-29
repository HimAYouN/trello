import { Navigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const token = useAuthStore((state) => state.token);

  if (token) return <Navigate to="/" replace />;

  return (
    <main className="login-screen flex min-h-screen items-center justify-center px-4 py-10">
      <section className="login-panel w-full max-w-md p-6 sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <span className="login-mark grid size-12 shrink-0 place-items-center">
            <Gamepad2 aria-hidden="true" size={24} />
          </span>
          <div>
            <p className="login-eyebrow">TEAM QUEST / 01</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pixel-muted)]">
              Your workspace
            </p>
          </div>
        </div>
        <h1 className="login-title mb-2 text-2xl sm:text-3xl">Join the party.</h1>
        <p className="mb-7 text-sm text-[var(--pixel-muted)]">
          Create your account and get your next project moving.
        </p>
        <RegisterForm />
        <div className="login-status mt-8 flex items-center justify-between border-t-2 border-dashed pt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--pixel-muted)]">
          <span>New player</span>
          <span className="flex items-center gap-2">
            <span className="login-online-dot" aria-hidden="true" />
            Ready to begin
          </span>
        </div>
      </section>
    </main>
  );
}