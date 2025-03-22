import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ActiveTests } from "@/components/dashboard/active-tests";
import { RecentReports } from "@/components/dashboard/recent-reports";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { HealthTrends } from "@/components/dashboard/health-trends";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      {/* User Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Hello, {user?.fullName.split(' ')[0] || "User"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome to your health dashboard</p>
      </div>
      
      {/* Stats Overview Cards */}
      <StatsOverview />
      
      {/* Active Tests with Timeline */}
      <ActiveTests />
      
      {/* Recent Reports and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RecentReports />
        <QuickActions />
      </div>
      
      {/* Health Trends */}
      <HealthTrends />
    </DashboardLayout>
  );
}
