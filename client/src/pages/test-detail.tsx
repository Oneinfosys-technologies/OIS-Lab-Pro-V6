import { useParams, Link } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BookingForm } from "@/components/booking/booking-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestDetail() {
  const { id } = useParams();
  
  const { data: test, isLoading } = useQuery({
    queryKey: [`/api/tests/${id}`],
    enabled: !!id,
  });
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/book-test">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to test search
          </Link>
        </Button>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isLoading ? <Skeleton className="h-8 w-64" /> : test?.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {isLoading ? <Skeleton className="h-5 w-96 mt-1" /> : "Complete your booking details"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Skeleton className="h-[500px] w-full" />
          ) : test ? (
            <BookingForm test={test} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Test Not Found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  The test you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/book-test">
                  <Button>Browse Available Tests</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : test ? (
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">Price</h3>
                  <p className="text-xl font-semibold">₹{test.price}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">Description</h3>
                  <p className="mt-1">{test.description || "No description available"}</p>
                </div>
                
                {test.preparationInstructions && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">Preparation Instructions</h3>
                      <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900 rounded-md flex gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          {test.preparationInstructions}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
