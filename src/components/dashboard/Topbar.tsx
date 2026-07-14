"use client";

import { Bell, Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { StockSearchBox } from "./StockSearchBox";
import { UserMenu } from "./UserMenu";

export function Topbar({
  title,
  subtitle,
  userEmail,
}: {
  title: string;
  subtitle: string;
  userEmail: string | null;
}) {
  const { setOpen } = useSidebar();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-ink hover:bg-page md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{title}</h1>
          <p className="mt-0.5 text-xs text-muted sm:text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
        <StockSearchBox />

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-ink hover:bg-page"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <UserMenu userEmail={userEmail} />
      </div>
    </div>
  );
}
