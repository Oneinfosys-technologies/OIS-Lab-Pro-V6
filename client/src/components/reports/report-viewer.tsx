import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer, Share2 } from "lucide-react";
import { generateTestInsights, getSeverityColor } from "@/lib/utils/ai-insights";
import { Report } from "@shared/schema";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportViewerProps {
  report: Report & {
    test?: any;
    booking?: any;
    user?: {
      fullName: string;
      email: string;
      phone?: string;
    };
  };
  loading?: boolean;
}

export function ReportViewer({ report, loading = false }: ReportViewerProps) {
  const [insights, setInsights] = useState<any | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (report?.results) {
      // If insights are already available in the report, use them
      if (report.insights) {
        setInsights(report.insights);
        return;
      }
      
      // Otherwise, generate insights from the results
      setInsightsLoading(true);
      generateTestInsights(report.results)
        .then(result => {
          setInsights(result.insights);
          setInsightsLoading(false);
        })
        .catch(error => {
          console.error("Failed to generate insights:", error);
          setInsightsLoading(false);
        });
    }
  }, [report]);

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">Report not found</h3>
        <p className="text-slate-500 dark:text-slate-400">
          The report you're looking for doesn't exist or has expired
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{report.test?.name} Report</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {report.reportId} • Generated on {format(new Date(report.generatedDate), "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={printReport}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Patient Name</p>
              <p className="font-medium">{report.user?.fullName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Contact</p>
              <p className="font-medium">{report.user?.phone || report.user?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Booking ID</p>
              <p className="font-medium">{report.booking?.bookingId || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sample Collection</p>
              <p className="font-medium">
                {report.booking?.scheduledDate 
                  ? format(new Date(report.booking.scheduledDate), "MMMM d, yyyy 'at' h:mm a")
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {report.results && Array.isArray(report.results) ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.results.map((result, index) => {
                  // Check if result is outside reference range
                  let status = "normal";
                  let statusText = "Normal";
                  
                  if (typeof result.value === 'number' && result.referenceRange) {
                    const range = result.referenceRange.split('-').map(r => parseFloat(r.trim()));
                    if (result.value < range[0]) {
                      status = "low";
                      statusText = "Low";
                    } else if (result.value > range[1]) {
                      status = "high";
                      statusText = "High";
                    }
                  }
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.value}</TableCell>
                      <TableCell>{result.unit}</TableCell>
                      <TableCell>{result.referenceRange}</TableCell>
                      <TableCell className={getSeverityColor(status)}>{statusText}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-slate-500 dark:text-slate-400">No result data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {insightsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <p className="text-lg">{insights.summary}</p>
              
              {insights.abnormalValues && insights.abnormalValues.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Abnormal Values</h3>
                  {insights.abnormalValues.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${
                        item.severity === 'low' 
                          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
                          : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}: {item.value}</h4>
                        <span className={getSeverityColor(item.severity)}>
                          {item.severity === 'low' ? 'Below Range' : 'Above Range'}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">{item.explanation}</p>
                      <p className="mt-2 font-medium">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {insights.recommendations && insights.recommendations.length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-2">General Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index} className="text-slate-700 dark:text-slate-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-4 text-slate-500 dark:text-slate-400">
              No insights available for this report
            </p>
          )}
          
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
            <p>
              <strong>Disclaimer:</strong> These insights are generated using AI and are meant for informational
              purposes only. Always consult with a healthcare professional for medical advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
