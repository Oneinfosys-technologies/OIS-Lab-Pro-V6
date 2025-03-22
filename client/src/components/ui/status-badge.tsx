import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "booked":
        return {
          color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
          label: "Booked"
        };
      case "sample_collected":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          label: "Sample Collected"
        };
      case "processing":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          label: "Processing"
        };
      case "analyzing":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
          label: "Analyzing"
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          label: "Completed"
        };
      case "home":
        return {
          color: "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300",
          label: "Home"
        };
      case "lab":
        return {
          color: "bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300",
          label: "Lab"
        };
      default:
        return {
          color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
          label: status
        };
    }
  };

  const { color, label } = getStatusConfig(status);

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full inline-flex items-center",
        color,
        className
      )}
    >
      {label}
    </span>
  );
}
