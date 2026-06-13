"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/presentation/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.04,
        }}
      />

      {/* Card */}
      <div
        className="relative w-full bg-bg-surface shadow-[var(--shadow-md)]"
        style={{
          maxWidth: 420,
          borderRadius: "var(--radius-xl)",
          padding: 40,
          margin: 16,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              backgroundColor: "var(--accent)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="9" y1="15" x2="15" y2="15" />
              <polyline points="12,12 9,15 12,18" />
            </svg>
          </div>
          <span
            className="font-display font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18 }}
          >
            JATA
          </span>
        </div>

        {/* Heading */}
        <h1
          className="font-display font-semibold mb-1"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, lineHeight: 1.2, color: "var(--text-primary)" }}
        >
          Welcome back
        </h1>
        <p
          className="mb-6"
          style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
        >
          Sign in to your workspace
        </p>
        <p
          className="-mt-4 mb-6"
          style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-inter)" }}
        >
          Job Application Tracker &amp; Assistant
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error && !email ? error : undefined}
          />
          <Input
            label="Password"
            isPassword
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error && !password ? error : undefined}
          />

          {error && email && password && (
            <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>
          )}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign in
          </Button>
        </form>

        <p
          className="text-center mt-4"
          style={{ fontSize: 12, color: "var(--text-tertiary)" }}
        >
          This app is private. No registration available.
        </p>
      </div>
    </div>
  );
}
