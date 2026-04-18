"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "./Card";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Budget", href: "/budget" },
  { label: "Goals", href: "/goals" },
  { label: "Transactions", href: "/transactions" },
  { label: "Tools", href: "/tools" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <Card variant="glass" className="sticky top-0 z-50 mb-0 rounded-none border-b border-t-0 border-l-0 border-r-0">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-3xl">💰</span>
          <span className="text-accent-light">VaultLife</span>
        </Link>

        <nav className="flex gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                  isActive
                    ? "bg-accent-purple/20 text-accent-light border border-accent-purple/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-dark-border/30"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="text-sm text-gray-400">
          💜 Welcome back!
        </div>
      </div>
    </Card>
  );
}
