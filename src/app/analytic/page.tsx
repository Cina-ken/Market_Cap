import { LineChart } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function AnalyticPage() {
  return (
    <DashboardShell
      title="Analytic"
      subtitle="Deeper performance insights for your watchlist."
    >
      <ComingSoon
        icon={LineChart}
        title="Analytics are on the way"
        description="Performance breakdowns, sector exposure, and gain/loss tracking for your saved stocks will show up here."
      />
    </DashboardShell>
  );
}
