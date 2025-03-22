import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "switch" | "button";
  label?: boolean;
  className?: string;
}

export function ThemeToggle({ 
  variant = "button", 
  label = false,
  className
}: ThemeToggleProps) {
  const { setTheme, isDarkMode } = useTheme();

  if (variant === "switch") {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        {label && (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
        )}
        <Switch
          checked={isDarkMode}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          className="ml-4"
        />
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      className={className}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
