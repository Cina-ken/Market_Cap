"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/auth-actions";

function initialsFromEmail(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function UserMenu({ userEmail }: { userEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!userEmail) {
    return (
      <Link
        href="/login"
        className="flex h-10 shrink-0 items-center rounded-full bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
        title={userEmail}
      >
        {initialsFromEmail(userEmail)}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-panel p-1.5 shadow-lg">
          <div className="truncate px-3 py-2 text-xs text-muted">{userEmail}</div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-ink hover:bg-page"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
