"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userID");
    document.cookie = "userID=; Max-Age=0; Path=/; SameSite=Lax";
    router.push("/login");
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <nav className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="font-black text-3xl md:text-4xl uppercase text-center tracking-wide">
          Logaira
        </h1>
        <ul className="mt-6 flex justify-center items-center gap-6">
          <Link href="/">
            <li className="text-base md:text-lg font-semibold hover:text-muted-foreground transition-colors cursor-pointer">
              Dashboard
            </li>
          </Link>
          <Link href="/incomes">
            <li className="text-base md:text-lg font-semibold hover:text-muted-foreground transition-colors cursor-pointer">
              Incomes
            </li>
          </Link>
          <Link href="/expenses">
            <li className="text-base md:text-lg font-semibold hover:text-muted-foreground transition-colors cursor-pointer">
              Expenses
            </li>
          </Link>
          <Button variant="secondary" onClick={handleLogout} className="ml-2">
            Logout
          </Button>
        </ul>
      </nav>
    </header>
  );
}
