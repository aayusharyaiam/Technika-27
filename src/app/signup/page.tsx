"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const houses = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"] as const;

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    // Randomly assign one of the four houses.
    const house = houses[Math.floor(Math.random() * houses.length)];

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
          college: college.trim(),
          phone: phone.trim(),
          house,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (data.session) {
      window.location.href = "/dashboard";
      return;
    } else {
      setMessage(
        `Account created! Your house is ${house}. Check your email to confirm your account.`,
      );
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSignup}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border p-6"
      >
        <h1 className="text-3xl font-bold">Join Hogwarts</h1>
        <p>Make your account and discover your house.</p>

        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-lg border p-3"
          autoComplete="name"
          maxLength={100}
          required
        />

        <input
          placeholder="College name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          className="rounded-lg border p-3"
          maxLength={200}
          required
        />

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg border p-3"
          autoComplete="tel"
          maxLength={20}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border p-3"
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border p-3"
          autoComplete="new-password"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Join Hogwarts"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}
