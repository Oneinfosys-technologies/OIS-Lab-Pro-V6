import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Eye, Download, ChevronRight, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentReports() {
  const { data: reports, isLoading } = useQuery<any[]>({
    queryKey: ["/api/reports"],
  });
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : reports && reports.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                    <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Test Name</th>
                    <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Date</th>
                    <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
                    <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 3).map((report) => (
                    <tr key={report.id} className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{report.test?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{report.reportId}</p>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">
                        {format(new Date(report.generatedDate), "MMM d, yyyy")}
                      </td>
                      <td className="py-3">
                        <StatusBadge status="completed" />
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/reports/${report.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/reports/download/${report.reportId}`}>
                              <Download className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Button 
              variant="link" 
              className="mt-4 text-primary-600 dark:text-primary-400 font-medium text-sm flex items-center p-0"
              asChild
            >
              <Link href="/my-reports">
                View All Reports 
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium mb-2">No Reports Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              You don't have any completed test reports yet.
            </p>
            <Link href="/book-test">
              <Button>Book a Test</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
