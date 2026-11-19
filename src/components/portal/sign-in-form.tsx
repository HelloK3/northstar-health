"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LogIn } from "lucide-react";
import { startSession } from "@/lib/demo-session";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { Alert } from "@/components/ui/primitives";

const DEMO = { name: "Jordan Rivera", email: "jordan.rivera@example.com" };

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function enterDemo(name: string, address: string) {
    startSession({ name, email: address });
    router.push("/portal/dashboard");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Enter the email address for your account.";
    if (password.length < 8) next.password = "Passwords are at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // Any well-formed details "work" in this demo. Nothing is checked or sent.
      const first = email.split("@")[0].split(/[._-]/)[0] || "there";
      enterDemo(first.charAt(0).toUpperCase() + first.slice(1), email);
    }
  }

  return (
    <div className="space-y-6">
      <Alert tone="warning" title="Demo portal">
        This sign-in is simulated. Don&apos;t enter a real password. Use the demo account below or any made-up
        details.
      </Alert>

      <Button size="lg" className="w-full" onClick={() => enterDemo(DEMO.name, DEMO.email)}>
        <LogIn aria-hidden="true" /> Continue with the demo account
      </Button>

      <div className="flex items-center gap-3 text-sm text-ink-500">
        <span className="h-px flex-1 bg-ink-200" /> or sign in <span className="h-px flex-1 bg-ink-200" />
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextField
          label="Email"
          type="email"
          autoComplete="username"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
