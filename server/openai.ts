import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TestResult {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
}

interface InsightResponse {
  summary: string;
  abnormalValues: Array<{
    name: string;
    value: string | number;
    explanation: string;
    recommendation: string;
    severity: "normal" | "low" | "high" | "critical";
  }>;
  recommendations: string[];
}

/**
 * Generates AI-powered insights for test results using OpenAI
 */
export async function generateTestInsights(results: TestResult[]): Promise<InsightResponse> {
  try {
    // For normal reference range analysis, we'll do that on our own
    const abnormalValues = results.filter(result => {
      if (typeof result.value === 'number') {
        const range = result.referenceRange.split('-').map(r => parseFloat(r.trim()));
        return result.value < range[0] || result.value > range[1];
      }
      return false;
    });

    // Prepare the abnormal values for better analysis
    const abnormalValuesInfo = abnormalValues.map(item => {
      const range = item.referenceRange.split('-').map(r => parseFloat(r.trim()));
      const value = typeof item.value === 'number' ? item.value : parseFloat(String(item.value));
      const isLow = value < range[0];
      
      return {
        name: item.name,
        value: item.value,
        unit: item.unit,
        referenceRange: item.referenceRange,
        status: isLow ? "low" : "high"
      };
    });

    // If there are abnormal values, get detailed insights
    if (abnormalValues.length > 0) {
      const prompt = `
You are a medical laboratory AI assistant providing insights on test results.
Analyze these abnormal lab results, providing clear explanations and actionable recommendations.
For each abnormal value, explain what it means in plain language for the patient and give appropriate health recommendations.
Be informative but not alarmist, and always recommend consulting a healthcare provider.

Test results with abnormal values:
${JSON.stringify(abnormalValuesInfo, null, 2)}

Provide analysis in the following JSON format:
{
  "summary": "A 1-2 sentence overview of the test results",
  "abnormalValues": [
    {
      "name": "Test name",
      "value": "Value",
      "explanation": "Clear explanation of what this means in plain language",
      "recommendation": "Specific recommendation for this value",
      "severity": "low/high/critical"
    }
  ],
  "recommendations": ["3-5 general health recommendations based on these results"]
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Failed to generate insights: No content in response");
      }

      try {
        const aiResponse = JSON.parse(content);
        return aiResponse;
      } catch (error) {
        console.error("Failed to parse OpenAI response:", error);
        throw new Error("Failed to parse insights response");
      }
    } else {
      // If no abnormal values, generate a more general response
      return {
        summary: "Great news! All your test results are within normal ranges.",
        abnormalValues: [],
        recommendations: [
          "Continue maintaining your current health routine.",
          "Stay hydrated by drinking adequate water throughout the day.",
          "Engage in regular physical activity for at least 30 minutes daily.",
          "Ensure you get 7-8 hours of quality sleep each night.",
          "Schedule regular check-ups to monitor your health proactively."
        ]
      };
    }
  } catch (error) {
    console.error("Error generating insights with OpenAI:", error);
    throw new Error("Failed to generate insights. Please try again later.");
  }
}