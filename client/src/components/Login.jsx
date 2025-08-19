"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ErrorState from "./ErrorState";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userID = localStorage.getItem("userID");
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date().getDate();

    const date = {
      year: currentYear,
      month: currentMonth,
      day: currentDate,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    if (result.code == 200) {
      localStorage.setItem("userID", result.token);
      // Mirror token into a cookie so middleware (server/edge) can authenticate
      // 7 days expiry; adjust as needed
      const maxAge = 7 * 24 * 60 * 60; // seconds
      document.cookie = `userID=${result.token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
      router.push("/");
    } else {
      setError("Login failed. Please try again" + " " + result.message);
    }
  };

  return (
    <section className="bg-background max-w-md mx-auto rounded-lg border p-6 shadow-sm">
      <h1 className="text-center font-bold text-2xl">Login</h1>
      <p className="text-center text-sm text-muted-foreground mb-5">
        Enter your credentials to access your account
      </p>
      <form className="space-y-3" method="post" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          required
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          required
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">Login</Button>
        {error && <ErrorState message={error} />}
      </form>
    </section>
  );
}
