"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-4 p-6"
      >
        <h1 className="text-3xl font-bold">Welcome back</h1>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        <p>
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
