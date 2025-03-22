import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Users, TestTube, Settings, BarChart4 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { TEST_STATUSES } from "@shared/schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [reportResults, setReportResults] = useState("");
  
  // Get all bookings for admin
  const { data: bookings, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/bookings"],
  });
  
  // Filter bookings based on search term
  const filteredBookings = bookings?.filter(booking => 
    booking.test?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number, status: string, notes: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/bookings/${id}/status`, { status, notes });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The booking status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      setStatusDialogOpen(false);
      setSelectedBooking(null);
      setNewStatus("");
      setStatusNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: async ({ bookingId, results }: { bookingId: number, results: any }) => {
      // Parse JSON string to array of objects
      let parsedResults;
      try {
        parsedResults = JSON.parse(results);
      } catch (error) {
        throw new Error("Invalid JSON format for results");
      }
      
      // The server will automatically generate AI insights using OpenAI
      const res = await apiRequest("POST", "/api/admin/reports", { 
        bookingId, 
        results: parsedResults
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Report created",
        description: "The test report has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      setReportDialogOpen(false);
      setSelectedBooking(null);
      setReportResults("");
    },
    onError: (error) => {
      toast({
        title: "Error creating report",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleUpdateStatus = () => {
    if (!selectedBooking || !newStatus) return;
    
    updateStatusMutation.mutate({
      id: selectedBooking.id,
      status: newStatus,
      notes: statusNotes
    });
  };
  
  const handleCreateReport = () => {
    if (!selectedBooking || !reportResults) return;
    
    createReportMutation.mutate({
      bookingId: selectedBooking.id,
      results: reportResults
    });
  };
  
  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = Object.values(TEST_STATUSES);
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    // Only allow moving one step forward or backward
    const availableStatuses = allStatuses.filter((_, index) => 
      index === currentIndex + 1 || index === currentIndex - 1 || index === currentIndex
    );
    
    return availableStatuses;
  };
  
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
                <p className="text-3xl font-bold">{bookings?.length || 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TestTube className="h-10 w-10 text-secondary-600 dark:text-secondary-400" />
              <div>
                <p className="text-3xl font-bold">
                  {bookings?.filter(b => b.status === TEST_STATUSES.ANALYZING).length || 0}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tests Being Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart4 className="h-10 w-10 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-3xl font-bold">
                  {bookings?.filter(b => b.status === TEST_STATUSES.COMPLETED).length || 0}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Completed Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bookings Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
          <CardDescription>Update status and generate reports for tests</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Input 
              className="pl-10"
              placeholder="Search by test name, patient name, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono">{booking.bookingId}</TableCell>
                      <TableCell>{booking.user?.fullName}</TableCell>
                      <TableCell>{booking.test?.name}</TableCell>
                      <TableCell>
                        {format(new Date(booking.scheduledDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNewStatus(booking.status);
                              setStatusDialogOpen(true);
                            }}
                          >
                            Update Status
                          </Button>
                          
                          {booking.status === TEST_STATUSES.ANALYZING && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setReportDialogOpen(true);
                              }}
                            >
                              Generate Report
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <Settings className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm ? "Try a different search term" : "There are no bookings in the system yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Test Status</DialogTitle>
            <DialogDescription>
              Change the status of the test and add notes for the patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Status</p>
              <StatusBadge status={selectedBooking?.status || ""} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">New Status</p>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {selectedBooking && getStatusOptions(selectedBooking.status).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Notes (Optional)</p>
              <Textarea 
                placeholder="Add notes about the status change" 
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Generate Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generate Test Report</DialogTitle>
            <DialogDescription>
              Enter the test results to generate a report for {selectedBooking?.test?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Test Results (JSON Format)</p>
              <Textarea 
                placeholder='Enter results as JSON array. Example: [{"name":"Hemoglobin","value":14.5,"unit":"g/dL","referenceRange":"13.5-17.5"}]'
                value={reportResults}
                onChange={(e) => setReportResults(e.target.value)}
                className="min-h-[200px] font-mono"
              />
              <p className="text-xs text-slate-500">
                Results should be formatted as a JSON array with name, value, unit, and referenceRange fields.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateReport}
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
