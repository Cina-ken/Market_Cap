import { Globe } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function CommunityPage() {
  return (
    <DashboardShell
      title="Community"
      subtitle="Connect with other MarketCap investors."
    >
      <ComingSoon
        icon={Globe}
        title="Community is on the way"
        description="Discussion threads, shared watchlists, and investor insights will show up here."
      />
    </DashboardShell>
  );
}
