import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Test, TestCategory } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestSearchProps {
  onTestSelect: (test: Test) => void;
}

export function TestSearch({ onTestSelect }: TestSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories, isLoading: isLoadingCategories } = useQuery<TestCategory[]>({
    queryKey: ["/api/test-categories"],
  });

  const { data: tests, isLoading: isLoadingTests } = useQuery<Test[]>({
    queryKey: ["/api/tests"],
  });

  const filteredTests = tests?.filter(test => {
    const matchesSearch = searchTerm === "" || 
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.description && test.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || test.categoryId === parseInt(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text" 
            placeholder="Search tests by name or symptom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium">Filter by category:</span>
          <Select 
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Available Tests</h3>
        
        {isLoadingTests ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : filteredTests && filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <Card 
              key={test.id} 
              className="cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              onClick={() => onTestSelect(test)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h4 className="font-medium text-lg">{test.name}</h4>
                    {test.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{test.description}</p>
                    )}
                  </div>
                  <div className="mt-3 md:mt-0 flex items-center space-x-3">
                    <span className="text-lg font-medium text-slate-900 dark:text-white">
                      ₹{test.price}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onTestSelect(test);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed rounded-lg border-slate-300 dark:border-slate-700">
            <Search className="h-10 w-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium mb-1">No Tests Found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try changing your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
