import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PortfolioDashboardBody } from "@/components/dashboard/PortfolioDashboardBody";

export default function PortfolioPage() {
  return (
    <DashboardShell
      title="Portfolio"
      subtitle="Track your stocks, news and performance."
    >
      <PortfolioDashboardBody />
    </DashboardShell>
  );
}
