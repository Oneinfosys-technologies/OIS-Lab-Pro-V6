import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Beaker, FileText, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Booking, Report, Test } from "@shared/schema";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface UpcomingTest extends Booking {
  test?: Test;
}

export function StatsOverview() {
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<UpcomingTest[]>({
    queryKey: ["/api/bookings"],
  });
  
  const { data: reports, isLoading: isLoadingReports } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });
  
  // Filter upcoming tests
  const upcomingTests = bookings?.filter(booking => 
    booking.status !== "completed" && 
    new Date(booking.scheduledDate) >= new Date()
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  
  // Filter pending reports
  const pendingReports = bookings?.filter(booking => 
    booking.status !== "completed" && booking.status !== "booked"
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Upcoming Appointments */}
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Tests</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isLoadingBookings 
                  ? "Loading..." 
                  : `You have ${upcomingTests?.length || 0} scheduled test${upcomingTests?.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            <CalendarIcon className="text-primary-600 dark:text-primary-400" />
          </div>
          
          {isLoadingBookings ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <>
              {upcomingTests && upcomingTests.length > 0 ? (
                upcomingTests.slice(0, 2).map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg mb-3"
                  >
                    <div>
                      <p className="font-medium">{booking.test?.name || "Loading test details..."}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {format(new Date(booking.scheduledDate), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <StatusBadge status={booking.collectionType} />
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <p className="text-slate-500 dark:text-slate-400">No upcoming tests</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Pending Reports */}
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pending Reports</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isLoadingBookings 
                  ? "Loading..." 
                  : `${pendingReports?.length || 0} reports awaiting results`
                }
              </p>
            </div>
            <FileText className="text-accent-500" />
          </div>
          
          {isLoadingBookings ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReports && pendingReports.length > 0 ? (
                pendingReports.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                      booking.status === 'analyzing' 
                        ? 'bg-yellow-500' 
                        : booking.status === 'processing' 
                          ? 'bg-blue-500' 
                          : 'bg-blue-800'
                    }`}></div>
                    <span className="text-sm font-medium flex-1">{booking.test?.name || "Test"}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {booking.status === 'analyzing' ? 'Due soon' : 'In progress'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400">No pending reports</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Health Insights */}
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Health Insights</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Based on your recent tests</p>
            </div>
            <TrendingUp className="text-secondary-600 dark:text-secondary-400" />
          </div>
          
          {isLoadingReports ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900">
                <p className="text-green-800 dark:text-green-300 text-sm font-medium">
                  Your latest test results are looking good
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900">
                <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
                  Remember to schedule your follow-up tests 
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Beaker className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400">Complete a test to see insights</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
