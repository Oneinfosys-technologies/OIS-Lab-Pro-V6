import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <MobileNav />
      <Sidebar className="hidden lg:block" />
      
      <main className="lg:ml-64 pt-4 px-4 pb-20 lg:pb-8">
        {children}
      </main>
    </div>
  );
}
