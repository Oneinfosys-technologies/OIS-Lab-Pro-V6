import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center font-bold", sizeClasses[size], className)}>
      <span className="text-primary-600 dark:text-primary-400">OIS</span>
      <span className="text-secondary-600 dark:text-secondary-400">LabPro</span>
    </div>
  );
}
