import { apiRequest } from "@/lib/queryClient";

interface TestResult {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
}

interface InsightResponse {
  insights: {
    summary: string;
    abnormalValues: Array<{
      name: string;
      value: string | number;
      explanation: string;
      recommendation: string;
      severity: "normal" | "low" | "high" | "critical";
    }>;
    recommendations: string[];
  };
}

export async function generateTestInsights(results: TestResult[]): Promise<InsightResponse> {
  try {
    // Call the API to generate insights using OpenAI
    const response = await apiRequest("POST", "/api/reports/generate-insights", { results });
    
    if (!response.ok) {
      throw new Error("Failed to generate insights from server");
    }
    
    const data = await response.json();
    
    // Structure the response in the expected format
    const insights: InsightResponse = {
      insights: {
        summary: data.summary || "Based on your test results, most values are within normal range.",
        abnormalValues: data.abnormalValues || [],
        recommendations: data.recommendations || []
      }
    };

    return insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    
    // Fallback to basic analysis if the API fails
    const abnormalValues = results.filter(result => {
      if (typeof result.value === 'number') {
        const range = result.referenceRange.split('-').map(r => parseFloat(r.trim()));
        return result.value < range[0] || result.value > range[1];
      }
      return false;
    });
    
    // Create a basic fallback response
    const fallbackInsights: InsightResponse = {
      insights: {
        summary: abnormalValues.length === 0 
          ? "All test results appear to be within normal ranges." 
          : `Some test values (${abnormalValues.length}) appear to be outside normal ranges.`,
        abnormalValues: abnormalValues.map(item => {
          const range = item.referenceRange.split('-').map(r => parseFloat(r.trim()));
          const value = typeof item.value === 'number' ? item.value : parseFloat(String(item.value));
          const isLow = value < range[0];
          
          return {
            name: item.name,
            value: item.value,
            explanation: `This value is ${isLow ? "below" : "above"} the reference range.`,
            recommendation: "Please consult with your healthcare provider about these results.",
            severity: isLow ? "low" : "high"
          };
        }),
        recommendations: [
          "Please consult with a healthcare professional for proper interpretation of these results."
        ]
      }
    };
    
    return fallbackInsights;
  }
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case "normal":
      return "text-green-600 dark:text-green-400";
    case "low":
      return "text-amber-600 dark:text-amber-400";
    case "high":
      return "text-orange-600 dark:text-orange-400";
    case "critical":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-slate-600 dark:text-slate-400";
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "booked":
      return "bg-slate-500"; // Grey
    case "sample_collected":
      return "bg-blue-500"; // Blue
    case "processing":
      return "bg-blue-800"; // Dark blue
    case "analyzing":
      return "bg-yellow-500"; // Yellow
    case "completed":
      return "bg-green-500"; // Green
    default:
      return "bg-slate-400";
  }
}
