import Link from "next/link";
import type { ReactNode } from "react";
import { PublicFooter } from "@/components/PublicFooter";

export function AuthCard({
  title,
  subtitle,
  error,
  notice,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  error?: string;
  notice?: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-page px-4 py-10">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <div className="grid h-8 w-8 shrink-0 grid-cols-2 grid-rows-2 gap-0.5">
              <span className="rounded-tl-full bg-accent" />
              <span className="rounded-tr-full bg-accent" />
              <span className="rounded-bl-full bg-accent" />
              <span className="rounded-br-full bg-accent" />
            </div>
            <span className="text-lg font-bold text-ink">MarketCap</span>
          </Link>

          <div className="rounded-2xl border border-line bg-panel p-6">
            <h1 className="text-xl font-bold text-ink">{title}</h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>

            {error && (
              <div className="mt-4 rounded-xl bg-negative-soft px-3 py-2 text-sm text-negative">
                {error}
              </div>
            )}
            {notice && (
              <div className="mt-4 rounded-xl bg-positive-soft px-3 py-2 text-sm text-positive">
                {notice}
              </div>
            )}

            <div className="mt-5">{children}</div>
          </div>

          <p className="mt-4 text-center text-sm text-muted">{footer}</p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
