import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Search, Download } from "lucide-react";
import { ReportViewer } from "@/components/reports/report-viewer";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const ReportIdSearchSchema = z.object({
  reportId: z.string().min(1, "Report ID is required"),
});

export default function ReportDownload() {
  const { reportId } = useParams();
  const { toast } = useToast();
  const [searchedReportId, setSearchedReportId] = useState<string | null>(reportId || null);
  
  // If reportId is in params, fetch the report
  const { data: report, isLoading } = useQuery<any>({
    queryKey: [`/api/reports/download/${searchedReportId}`],
    enabled: !!searchedReportId,
  });
  
  const form = useForm<z.infer<typeof ReportIdSearchSchema>>({
    resolver: zodResolver(ReportIdSearchSchema),
    defaultValues: {
      reportId: reportId || "",
    },
  });
  
  function onSubmit(values: z.infer<typeof ReportIdSearchSchema>) {
    setSearchedReportId(values.reportId);
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center">
              <Logo size="md" />
            </a>
          </Link>
          <ThemeToggle />
        </div>
        
        {!report ? (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Download Report</CardTitle>
              <CardDescription>
                Enter your report ID to access your test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="reportId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="e.g. OIS-REP-123456" 
                              {...field} 
                              className="pl-10"
                            />
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Searching..." : "Find Report"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-slate-200 dark:border-slate-700 pt-4 text-sm text-slate-500 dark:text-slate-400">
              If you're having trouble, please contact support for assistance
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setSearchedReportId(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to search
            </Button>
            
            <ReportViewer report={report} loading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
