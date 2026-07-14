import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-panel p-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon size={22} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      <span className="mt-4 rounded-full bg-page px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
        Coming soon
      </span>
    </div>
  );
}
