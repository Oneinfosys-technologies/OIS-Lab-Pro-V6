import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, HeadphonesIcon, PlusCircle } from "lucide-react";
import { Link } from "wouter";

export function QuickActions() {
  const actions = [
    {
      icon: <PlusCircle className="text-primary-600 dark:text-primary-400 mr-3 h-5 w-5" />,
      title: "Book a New Test",
      description: "Schedule online or home collection",
      path: "/book-test",
      primary: true
    },
    {
      icon: <Search className="text-slate-600 dark:text-slate-300 mr-3 h-5 w-5" />,
      title: "Find a Test",
      description: "Search by name or symptom",
      path: "/book-test?search=true",
      primary: false
    },
    {
      icon: <FileText className="text-slate-600 dark:text-slate-300 mr-3 h-5 w-5" />,
      title: "Download Report",
      description: "Enter test ID or phone number",
      path: "/report-download",
      primary: false
    },
    {
      icon: <HeadphonesIcon className="text-slate-600 dark:text-slate-300 mr-3 h-5 w-5" />,
      title: "Contact Support",
      description: "Get help with your questions",
      path: "/support",
      primary: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full p-4 justify-start ${
              action.primary
                ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-900 dark:text-primary-100"
                : "bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            asChild
          >
            <Link href={action.path}>
              {action.icon}
              <div className="text-left">
                <p className={`font-medium ${
                  action.primary
                    ? "text-primary-900 dark:text-primary-100"
                    : "text-slate-900 dark:text-white"
                }`}>
                  {action.title}
                </p>
                <p className={`text-xs ${
                  action.primary
                    ? "text-primary-600 dark:text-primary-300"
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                  {action.description}
                </p>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
