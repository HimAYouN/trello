import { useState } from "react";
import { isAxiosError } from "axios";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks";
import { Button } from "@/components/ui/8bit/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    console.log(email, password)
    e.preventDefault();
    mutate({ email, password });
  };

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? "Something went wrong. Please try again."
    : error
      ? "Something went wrong. Please try again."
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="login-label mb-2 block">
          Player email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="pixel-input w-full px-3 py-3 text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="login-label mb-2 block">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pixel-input w-full px-3 py-3 text-sm outline-none"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="pixel-error px-3 py-2 text-sm">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        font="retro"
        className="login-submit mt-2 min-h-12 w-full px-4 py-3 text-[10px] text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Loading..." : "Start playing"}
      </Button>

      <p className="pt-1 text-center text-sm text-[var(--pixel-muted)]">
        Don't have an account?{" "}
        <Link to="/register" className="login-link font-bold underline underline-offset-4">
          Register
        </Link>
      </p>
    </form>
  );
}