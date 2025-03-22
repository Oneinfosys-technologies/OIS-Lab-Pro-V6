import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Test } from "@shared/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Home, Building2, AlertCircle } from "lucide-react";
import { addDays, format, addHours, setHours, setMinutes, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface BookingFormProps {
  test: Test;
}

const FormSchema = z.object({
  testId: z.number(),
  collectionType: z.enum(["home", "lab"]),
  scheduledDate: z.date(),
  address: z.string().optional().refine((value, ctx) => {
    const collectionType = ctx.path[0] === 'address' 
      ? (ctx.parent as any).collectionType 
      : null;
    
    if (collectionType === "home" && (!value || value.trim() === "")) {
      return false;
    }
    return true;
  }, {
    message: "Address is required for home collection",
  }),
});

export function BookingForm({ test }: BookingFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Set min date to tomorrow and max date to 30 days from now
  const minDate = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 30);
  
  // Time slots (9 AM to 6 PM, hourly)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      testId: test.id,
      collectionType: "home",
      scheduledDate: minDate,
      address: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      let scheduledDateTime = data.scheduledDate;
      
      // If time slot is selected, update the date with the selected time
      if (selectedTimeSlot) {
        scheduledDateTime = new Date(data.scheduledDate);
        scheduledDateTime.setHours(selectedTimeSlot.getHours());
        scheduledDateTime.setMinutes(selectedTimeSlot.getMinutes());
      }
      
      const bookingData = {
        ...data,
        scheduledDate: scheduledDateTime.toISOString(),
      };
      
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking successful!",
        description: `Your ${test.name} has been booked successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!selectedTimeSlot) {
      toast({
        title: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }
    
    bookingMutation.mutate(data);
  }

  // Generate time slots for the selected date
  const getTimeSlots = (date: Date) => {
    const slots: Date[] = [];
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
    
    // Start from 9 AM
    let startHour = 9;
    
    // If booking for today, only show future time slots
    if (isToday) {
      startHour = now.getHours() + 1;
      if (startHour < 9) startHour = 9;
    }
    
    // Generate hourly slots from startHour to 6 PM
    for (let hour = startHour; hour <= 18; hour++) {
      const slotTime = setHours(setMinutes(new Date(date), 0), hour);
      
      // Only add future time slots
      if (isAfter(slotTime, now)) {
        slots.push(slotTime);
      }
    }
    
    return slots;
  };

  const timeSlots = form.watch("scheduledDate") ? getTimeSlots(form.watch("scheduledDate")) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book {test.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Show test details */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{test.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{test.description}</p>
                </div>
                <span className="font-medium">₹{test.price}</span>
              </div>
              
              {test.preparationInstructions && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Preparation: </span>
                    {test.preparationInstructions}
                  </p>
                </div>
              )}
            </div>
            
            {/* Collection Type */}
            <FormField
              control={form.control}
              name="collectionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Collection Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      <div className="flex-1">
                        <RadioGroupItem
                          value="home"
                          id="home"
                          className="peer sr-only"
                        />
                        <FormLabel
                          htmlFor="home"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 peer-data-[state=checked]:border-primary-600 dark:peer-data-[state=checked]:border-primary-500 peer-data-[state=checked]:bg-primary-50 dark:peer-data-[state=checked]:bg-primary-900/20 [&:has([data-state=checked])]:bg-primary-50 dark:[&:has([data-state=checked])]:bg-primary-900/20 cursor-pointer"
                        >
                          <Home className="mb-2 h-6 w-6" />
                          Home Collection
                        </FormLabel>
                      </div>
                      <div className="flex-1">
                        <RadioGroupItem
                          value="lab"
                          id="lab"
                          className="peer sr-only"
                        />
                        <FormLabel
                          htmlFor="lab"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 peer-data-[state=checked]:border-primary-600 dark:peer-data-[state=checked]:border-primary-500 peer-data-[state=checked]:bg-primary-50 dark:peer-data-[state=checked]:bg-primary-900/20 [&:has([data-state=checked])]:bg-primary-50 dark:[&:has([data-state=checked])]:bg-primary-900/20 cursor-pointer"
                        >
                          <Building2 className="mb-2 h-6 w-6" />
                          Lab Visit
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => 
                          date < minDate || date > maxDate
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Time Slots */}
            {form.watch("scheduledDate") && (
              <div className="space-y-3">
                <FormLabel>Select Time Slot</FormLabel>
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={selectedTimeSlot && 
                                selectedTimeSlot.getTime() === slot.getTime() 
                                ? "default" : "outline"}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        {format(slot, "h:mm a")}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    No available time slots for this date. Please select a different date.
                  </p>
                )}
              </div>
            )}
            
            {/* Address (for home collection) */}
            {form.watch("collectionType") === "home" && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete address for sample collection" 
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide your complete address including landmark and pin code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
