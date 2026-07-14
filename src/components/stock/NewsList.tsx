import { Newspaper } from "lucide-react";
import type { NewsArticle } from "@/lib/finnhub";

function formatNewsDate(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NewsList({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-5">
        <h3 className="text-base font-semibold text-ink">Latest News</h3>
        <p className="mt-3 text-sm text-muted">
          No recent news found for this stock.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <h3 className="text-base font-semibold text-ink">Latest News</h3>
      <div className="mt-3 divide-y divide-line">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Newspaper size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug text-ink">
                {article.headline}
              </p>
              <p className="mt-1 text-xs text-muted">
                {article.source} · {formatNewsDate(article.datetime)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
