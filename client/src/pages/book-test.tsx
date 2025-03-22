import { useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TestSearch } from "@/components/booking/test-search";
import { BookingForm } from "@/components/booking/booking-form";
import { Test } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BookTest() {
  const [location] = useLocation();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  
  // Check if search query is present in URL to auto-focus on search
  const showSearch = location.includes("search=true") || !selectedTest;
  
  const handleTestSelect = (test: Test) => {
    setSelectedTest(test);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {selectedTest ? `Book ${selectedTest.name}` : "Book a Test"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {selectedTest 
            ? "Complete your booking details"
            : "Search and select a test to book"
          }
        </p>
      </div>
      
      {selectedTest && !showSearch && (
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => setSelectedTest(null)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to search
        </Button>
      )}
      
      {showSearch ? (
        <TestSearch onTestSelect={handleTestSelect} />
      ) : selectedTest ? (
        <BookingForm test={selectedTest} />
      ) : null}
    </DashboardLayout>
  );
}
