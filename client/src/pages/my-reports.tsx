import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Download, Search, FileText, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/status-badge";

export default function MyReports() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get reports and bookings
  const { data: reports, isLoading: isLoadingReports } = useQuery<any[]>({
    queryKey: ["/api/reports"],
  });
  
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<any[]>({
    queryKey: ["/api/bookings"],
  });
  
  // Filter reports and bookings based on search term
  const filteredReports = reports?.filter(report => 
    report.test?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredBookings = bookings?.filter(booking => 
    booking.test?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Reports
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          View and download your test reports
        </p>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Input 
          className="pl-10"
          placeholder="Search by test name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>
      
      <Tabs defaultValue="reports">
        <TabsList className="mb-6">
          <TabsTrigger value="reports">Completed Reports</TabsTrigger>
          <TabsTrigger value="pending">Pending Tests</TabsTrigger>
        </TabsList>
        
        {/* Completed Reports Tab */}
        <TabsContent value="reports">
          {isLoadingReports ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.test?.name}</TableCell>
                        <TableCell className="font-mono">{report.reportId}</TableCell>
                        <TableCell>
                          {format(new Date(report.generatedDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/reports/${report.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/reports/download/${report.reportId}`}>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {searchTerm ? "Try a different search term" : "You don't have any completed reports yet"}
              </p>
              <Link href="/book-test">
                <Button>Book a Test</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        {/* Pending Tests Tab */}
        <TabsContent value="pending">
          {isLoadingBookings ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.test?.name}</TableCell>
                        <TableCell className="font-mono">{booking.bookingId}</TableCell>
                        <TableCell>
                          {format(new Date(booking.scheduledDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium mb-2">No Pending Tests</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {searchTerm ? "Try a different search term" : "You don't have any pending tests"}
              </p>
              <Link href="/book-test">
                <Button>Book a Test</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
