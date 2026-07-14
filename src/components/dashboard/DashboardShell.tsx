import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "./sidebar-context";
import { Topbar } from "./Topbar";
import { getCurrentUser } from "@/lib/auth";

export async function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-page">
        <Sidebar />
        <main className="w-full min-w-0 flex-1 space-y-4 p-4 sm:p-6">
          <Topbar
            title={title}
            subtitle={subtitle}
            userEmail={user?.email ?? null}
          />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
