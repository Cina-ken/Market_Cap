"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export function MobileMenuButton() {
  const { setOpen } = useSidebar();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-ink hover:bg-page md:hidden"
      aria-label="Open menu"
    >
      <Menu size={18} />
    </button>
  );
}
