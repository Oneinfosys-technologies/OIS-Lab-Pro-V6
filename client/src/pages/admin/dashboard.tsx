import { useState } from "react";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ActiveTests } from "@/components/dashboard/active-tests";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage bookings, tests, and report generation
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-slate-500">Active Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ActiveTests />
    </DashboardLayout>
  );
}