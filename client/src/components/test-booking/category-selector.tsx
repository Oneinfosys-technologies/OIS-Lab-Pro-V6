import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TestCategory } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  const { data: categories, isLoading } = useQuery<TestCategory[]>({
    queryKey: ["/api/test-categories"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 my-4">
        No test categories available
      </p>
    );
  }

  // Add "All" option to categories
  const allCategories = [
    { id: "all", name: "All Tests", icon: "grid_view", description: "View all available tests" },
    ...categories
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {allCategories.map((category) => (
        <Card 
          key={category.id} 
          className={cn(
            "cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 text-center p-3",
            selectedCategory === String(category.id) 
              ? "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700" 
              : ""
          )}
          onClick={() => onSelectCategory(String(category.id))}
        >
          <CardContent className="p-2 flex flex-col items-center justify-center h-full">
            <span className="material-icons-round text-slate-500 mb-1">
              {category.icon || "science"}
            </span>
            <span className="text-xs font-medium block">
              {category.name}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
