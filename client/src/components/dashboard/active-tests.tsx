import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, TestTube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Booking, TEST_STATUSES } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";
import { getStatusColor } from "@/lib/utils/ai-insights";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingWithDetails extends Booking {
  test?: any;
  statuses?: any[];
}

export function ActiveTests() {
  const [expandedBookings, setExpandedBookings] = useState<Record<number, boolean>>({});
  
  const { data: bookings, isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings"],
  });
  
  // Filter active tests (not completed)
  const activeTests = bookings?.filter(booking => booking.status !== TEST_STATUSES.COMPLETED);
  
  const toggleExpanded = (bookingId: number) => {
    setExpandedBookings(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };
  
  const getStatusSteps = (booking: BookingWithDetails) => {
    const allStatuses = [
      TEST_STATUSES.BOOKED,
      TEST_STATUSES.SAMPLE_COLLECTED,
      TEST_STATUSES.PROCESSING,
      TEST_STATUSES.ANALYZING,
      TEST_STATUSES.COMPLETED
    ];
    
    const currentStatusIndex = allStatuses.findIndex(status => status === booking.status);
    
    return allStatuses.map((status, index) => {
      const completed = index <= currentStatusIndex;
      const current = index === currentStatusIndex;
      
      let statusDate = "";
      if (booking.statuses) {
        const statusRecord = booking.statuses.find(s => s.status === status);
        if (statusRecord) {
          statusDate = format(new Date(statusRecord.timestamp), "MMM d, yyyy 'at' h:mm a");
        }
      }
      
      return { status, completed, current, statusDate };
    });
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Active Tests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : activeTests && activeTests.length > 0 ? (
          activeTests.map((booking) => (
            <div 
              key={booking.id} 
              className="border border-slate-100 dark:border-slate-700 rounded-lg p-4 mb-4 last:mb-0"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.test?.name || "Test"}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Test ID: <span className="font-mono">{booking.bookingId}</span>
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <StatusBadge status={booking.status} />
                </div>
              </div>
              
              {/* Status Timeline - Collapsed by Default */}
              <Button
                variant="ghost" 
                size="sm"
                className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center p-0 h-auto"
                onClick={() => toggleExpanded(booking.id)}
              >
                <ChevronDown className={`mr-1 h-4 w-4 transition-transform ${expandedBookings[booking.id] ? 'rotate-180' : ''}`} />
                {expandedBookings[booking.id] ? 'Hide Timeline' : 'View Timeline'}
              </Button>
              
              {expandedBookings[booking.id] && (
                <div className="relative mt-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 ml-3"></div>
                  <div className="space-y-6 relative z-10">
                    {getStatusSteps(booking).map((step, idx) => (
                      <div className="flex" key={idx}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 
                          ${step.completed 
                            ? step.current 
                              ? getStatusColor(step.status) + ' animate-pulse' 
                              : 'bg-green-500' 
                            : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                          {step.completed && !step.current ? (
                            <Check className="text-white text-sm" />
                          ) : step.current ? (
                            <TestTube className="text-white text-sm" />
                          ) : (
                            <span className="material-icons-round text-slate-500 dark:text-slate-400 text-sm">
                              {idx === 4 ? 'description' : 'science'}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className={`font-medium ${!step.completed && 'text-slate-400 dark:text-slate-500'}`}>
                            {step.status === TEST_STATUSES.BOOKED && 'Test Booked'}
                            {step.status === TEST_STATUSES.SAMPLE_COLLECTED && 'Sample Collected'}
                            {step.status === TEST_STATUSES.PROCESSING && 'Sample Processing'}
                            {step.status === TEST_STATUSES.ANALYZING && 'Analysis in Progress'}
                            {step.status === TEST_STATUSES.COMPLETED && 'Report Generation'}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {step.statusDate || (step.completed ? 'Completed' : 'Pending')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <TestTube className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium mb-2">No Active Tests</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              You don't have any active tests at the moment.
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActiveTests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Tests Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add active tests list */}
          <p className="text-muted-foreground">No active tests found.</p>
        </div>
      </CardContent>
    </Card>
  );
}
