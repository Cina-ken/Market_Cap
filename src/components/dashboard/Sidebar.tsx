"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  BarChart3,
  LineChart,
  Globe,
  CreditCard,
  User,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { label: "Overview", icon: Home, href: "/" },
  { label: "My Stock", icon: LayoutGrid, href: "/mystock" },
  { label: "Portfolio", icon: BarChart3, href: "/portfolio" },
  { label: "Analytic", icon: LineChart, href: "/analytic" },
  { label: "Community", icon: Globe, href: "/community" },
  { label: "Pricing", icon: CreditCard, href: "/pricing" },
  { label: "Account", icon: User, href: "/account" },
];

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] shrink-0 flex-col border-r border-line bg-panel px-4 py-6 transition-transform duration-200 ease-out md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 grid-cols-2 grid-rows-2 gap-0.5">
              <span className="rounded-tl-full bg-accent" />
              <span className="rounded-tr-full bg-accent" />
              <span className="rounded-bl-full bg-accent" />
              <span className="rounded-br-full bg-accent" />
            </div>
            <span className="text-lg font-bold text-ink">MarketCap</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-page md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-page text-ink"
                    : "text-muted hover:bg-page hover:text-ink"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-1 rounded-full bg-page p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 transition-colors ${
              theme === "light" ? "bg-panel text-ink shadow-sm" : "text-muted"
            }`}
          >
            <Sun size={14} />
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 transition-colors ${
              theme === "dark" ? "bg-panel text-ink shadow-sm" : "text-muted"
            }`}
          >
            <Moon size={14} />
            Dark
          </button>
        </div>
      </aside>
    </>
  );
}
