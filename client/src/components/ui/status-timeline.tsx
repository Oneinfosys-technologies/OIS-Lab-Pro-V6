import { Check, TestTube } from "lucide-react";
import { TEST_STATUSES } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { format } from "date-fns";

interface StatusTimelineProps {
  currentStatus: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}

export function StatusTimeline({ currentStatus, statusHistory = [] }: StatusTimelineProps) {
  const allStatuses = [
    TEST_STATUSES.BOOKED,
    TEST_STATUSES.SAMPLE_COLLECTED,
    TEST_STATUSES.PROCESSING,
    TEST_STATUSES.ANALYZING,
    TEST_STATUSES.COMPLETED
  ];
  
  const currentStatusIndex = allStatuses.findIndex(status => status === currentStatus);
  
  const getStatusSteps = () => {
    return allStatuses.map((status, index) => {
      const completed = index <= currentStatusIndex;
      const current = index === currentStatusIndex;
      
      let statusDate = "";
      const statusRecord = statusHistory.find(s => s.status === status);
      if (statusRecord) {
        statusDate = format(new Date(statusRecord.timestamp), "MMM d, yyyy 'at' h:mm a");
      }
      
      return { status, completed, current, statusDate, notes: statusRecord?.notes };
    });
  };
  
  const statusSteps = getStatusSteps();
  
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 ml-3"></div>
      <div className="space-y-6 relative z-10">
        {statusSteps.map((step, idx) => (
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
              {step.notes && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic">
                  {step.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
