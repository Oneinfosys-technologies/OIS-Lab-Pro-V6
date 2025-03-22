import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart } from "lucide-react";

export function HealthTrends() {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle>Health Trends</CardTitle>
        <Select defaultValue="6months">
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
            <SelectItem value="alltime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-700/30 p-4 h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart className="h-12 w-12 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
            <p className="text-slate-500 dark:text-slate-400">Your health trends will appear here after multiple tests</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
