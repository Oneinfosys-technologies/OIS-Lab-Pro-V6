import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/common/logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  TestTube, 
  FileText, 
  User,
  Menu,
  Bell,
  X
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="text-xl mb-1" />,
    },
    {
      id: "tests",
      label: "Tests",
      path: "/book-test",
      icon: <TestTube className="text-xl mb-1" />,
    },
    {
      id: "reports",
      label: "Reports",
      path: "/my-reports",
      icon: <FileText className="text-xl mb-1" />,
    },
    {
      id: "profile",
      label: "Profile",
      path: "/profile",
      icon: <User className="text-xl mb-1" />,
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className={cn("lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm", className)}>
        <div className="flex items-center space-x-2">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar isMobile={false} className="static w-full translate-x-0 shadow-none" />
            </SheetContent>
          </Sheet>
          
          <Logo size="sm" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
            </Button>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium text-sm">
              {user ? getInitials(user.fullName) : "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-30">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <Link key={tab.id} href={tab.path}>
              <a 
                className={cn(
                  "py-3 px-5 flex flex-col items-center text-xs",
                  "border-t-2",
                  location === tab.path 
                    ? "text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400" 
                    : "text-slate-500 dark:text-slate-400 border-transparent"
                )}
              >
                {tab.icon}
                {tab.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
