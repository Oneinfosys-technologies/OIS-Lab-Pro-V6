import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ReportViewer } from "@/components/reports/report-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function ReportView() {
  const { id } = useParams();
  
  const { data: report, isLoading } = useQuery<any>({
    queryKey: [`/api/reports/${id}`],
    enabled: !!id,
  });
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/my-reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reports
          </Link>
        </Button>
        
        <ReportViewer report={report} loading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
