import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/common/logo";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TestTube, 
  FileText, 
  History, 
  HeadphonesIcon, 
  LogOut,
  Users,
  Settings,
  UserCircle,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
}

export function Sidebar({ className, isMobile = false }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
    },
    {
      name: "Book Test",
      path: "/book-test",
      icon: <TestTube className="mr-3 h-5 w-5" />,
    },
    {
      name: "My Reports",
      path: "/my-reports",
      icon: <FileText className="mr-3 h-5 w-5" />,
    },
    {
      name: "History",
      path: "/history",
      icon: <History className="mr-3 h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserCircle className="mr-3 h-5 w-5" />,
    },
    {
      name: "Support",
      path: "/support",
      icon: <HeadphonesIcon className="mr-3 h-5 w-5" />,
    }
  ];

  const adminMenuItems = [
    {
      name: "Admin Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
    },
    {
      name: "Test Management",
      path: "/admin/tests",
      icon: <TestTube className="mr-3 h-5 w-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="mr-3 h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="mr-3 h-5 w-5" />,
    }
  ];
  
  const superAdminMenuItems = [
    {
      name: "SuperAdmin Dashboard",
      path: "/sa-dashboard",
      icon: <Building2 className="mr-3 h-5 w-5" />,
    },
    {
      name: "Labs Management",
      path: "/sa-dashboard?tab=labs",
      icon: <Building2 className="mr-3 h-5 w-5" />,
    },
    {
      name: "Subscriptions",
      path: "/sa-dashboard?tab=subscriptions",
      icon: <FileText className="mr-3 h-5 w-5" />,
    },
    {
      name: "System Settings",
      path: "/sa-dashboard?tab=settings",
      icon: <Settings className="mr-3 h-5 w-5" />,
    }
  ];

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out",
        isMobile && "-translate-x-full",
        "bg-white dark:bg-slate-800 shadow-lg",
        className
      )}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center mb-8">
          <Logo />
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={cn(
                      "flex items-center p-3 text-base rounded-lg",
                      location === item.path 
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          
          {isAdmin && (
            <>
              <h3 className="mt-6 mb-2 px-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                Admin
              </h3>
              <ul className="space-y-1">
                {adminMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <a 
                        className={cn(
                          "flex items-center p-3 text-base rounded-lg",
                          location === item.path 
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        )}
                      >
                        {item.icon}
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {isSuperAdmin && (
            <>
              <h3 className="mt-6 mb-2 px-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                SuperAdmin
              </h3>
              <ul className="space-y-1">
                {superAdminMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <a 
                        className={cn(
                          "flex items-center p-3 text-base rounded-lg",
                          location.startsWith(item.path.split('?')[0])
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        )}
                      >
                        {item.icon}
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-6">
          <ThemeToggle variant="switch" label={true} className="mb-4" />
          <Button
            variant="ghost"
            className="w-full justify-start p-3 text-base rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
            {logoutMutation.isPending && (
              <span className="spinner ml-2"></span>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
