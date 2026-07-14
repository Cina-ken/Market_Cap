import Link from "next/link";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-10 w-full max-w-3xl px-4 pb-6 text-center text-xs text-muted">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/terms" className="hover:text-ink">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-ink">
          Privacy Policy
        </Link>
        <a href="mailto:support@marketcap.app" className="hover:text-ink">
          Contact
        </a>
      </div>
      <p className="mt-2">&copy; {year} MarketCap. All rights reserved.</p>
    </footer>
  );
}
