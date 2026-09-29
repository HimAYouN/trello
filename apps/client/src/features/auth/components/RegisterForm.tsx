import { useState } from "react";
import { isAxiosError } from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/8bit/button";
import { useRegister } from "../hooks";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const { mutate, isPending, error } = useRegister();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    mutate({ name, email, password });
  };

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? "Something went wrong. Please try again."
    : error
      ? "Something went wrong. Please try again."
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="login-label mb-2 block">
          Player name
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jane Doe"
          className="pixel-input w-full px-3 py-3 text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="login-label mb-2 block">
          Player email
        </label>
        <input
          id="register-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jane@example.com"
          className="pixel-input w-full px-3 py-3 text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="login-label mb-2 block">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordMismatch(false);
          }}
          className="pixel-input w-full px-3 py-3 text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="login-label mb-2 block">
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setPasswordMismatch(false);
          }}
          className="pixel-input w-full px-3 py-3 text-sm outline-none"
        />
      </div>

      {(passwordMismatch || errorMessage) && (
        <p role="alert" className="pixel-error px-3 py-2 text-sm">
          {passwordMismatch ? "Passwords do not match." : errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        font="retro"
        className="login-submit mt-2 min-h-12 w-full px-4 py-3 text-[10px] text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Loading..." : "Create account"}
      </Button>

      <p className="pt-1 text-center text-sm text-[var(--pixel-muted)]">
        Already have an account?{" "}
        <Link to="/login" className="login-link font-bold underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}