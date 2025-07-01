
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import {
  CustomerAnalysisResponse, EmailContentResponse, SendTimeOptimizationResponse,
  PerformanceAnalysisResponse, ProductRecommendationResponse, EmailSequenceResponse,
  CustomerAnalysisInput, EmailContentInput, SendTimeOptimizationInput, CampaignMetricsInput,
  ProductRecommendationInput, EmailSequenceInput,
  GeneralAiQueryInput, GeneralAiResponse
} from '../types';
import { GEMINI_TEXT_MODEL } from "../constants";

let ai: GoogleGenAI | null = null;

const getAiInstance = (apiKey: string) => {
  if (!ai) {
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
        throw new Error("Gemini API key is not configured or is a placeholder. Please set a valid API key.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const parseJsonResponse = <T,>(text: string): T | null => {
  try {
    let jsonStr = text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", text);
    // Try to provide a more specific error if parsing fails
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("cannot")) {
        // Check if the text itself is an error message from the API
        throw new Error(`Gemini API returned an error or unparseable response: ${text.substring(0,200)}...`);
    }
    throw new Error(`Failed to parse JSON from Gemini response. Ensure the model is configured to return valid JSON. Details: ${(e as Error).message}`);
  }
};

const generateContent = async <TResponse,>(apiKey: string, prompt: string): Promise<TResponse | null> => {
  const currentAi = getAiInstance(apiKey);
  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return parseJsonResponse<TResponse>(response.text);
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    // Re-throw a more user-friendly error or specific error type
    throw new Error(`Error communicating with Gemini API: ${error.message || 'Unknown error'}`);
  }
};

export const getGeneralAiResponse = async (
  input: GeneralAiQueryInput,
  apiKey: string
): Promise<GeneralAiResponse | null> => {
  const prompt = `
    You are a helpful and versatile AI marketing assistant. The user will ask you a question or provide a statement. 
    Provide a concise, helpful, and relevant response.
    Return your response as a JSON object with a single key "responseText".

    User Query:
    \`\`\`
    ${input.userQuery}
    \`\`\`
    
    JSON Response:
  `;
  return generateContent<GeneralAiResponse>(apiKey, prompt);
};


export const analyzeCustomerData = async (
  input: CustomerAnalysisInput,
  apiKey: string
): Promise<CustomerAnalysisResponse | null> => {
  const prompt = `
    Analyze the following customer data, which might be provided as unstructured text, a JSON string, or a CSV string. 
    Intelligently interpret the data and provide a detailed JSON output.
    Customer Data:
    \`\`\`
    ${input.customerData}
    \`\`\`
    
    Based on this data, generate a JSON object with the following structure:
    {
      "profileSummary": "string (Detailed summary of the customer profile)",
      "segments": ["string (e.g., High-Value, At-Risk, New Customer, etc.)"],
      "personalizationOpportunities": ["string (Specific personalization ideas based on data)"],
      "contentThemes": ["string (Relevant content themes, e.g., 'Organic Skincare Tips', 'New Tech Arrivals')"],
      "productSuggestions": ["string (Specific product names or categories to suggest)"],
      "optimalFrequency": "string (e.g., 'Weekly', 'Bi-weekly', 'Monthly')",
      "optimalTiming": "string (e.g., 'Tuesday mornings', 'Weekend afternoons')"
    }
    Ensure the output is ONLY the JSON object, without any surrounding text or markdown.
  `;
  return generateContent<CustomerAnalysisResponse>(apiKey, prompt);
};

export const generateEmailContent = async (
  input: EmailContentInput,
  apiKey: string
): Promise<EmailContentResponse | null> => {
  const prompt = `
    Create a personalized email campaign based on the following details. Provide the output as a JSON object.
    Campaign Details:
    - Segment: ${input.segment}
    - Campaign Goal: ${input.campaignGoal}
    - Product Focus: ${input.productFocus}
    - Special Offers: ${input.specialOffers}
    - Brand Voice: ${input.brandVoice}
    - Customer Insights: ${input.customerInsights}

    Generate a JSON object with the following structure:
    {
      "subjectLines": [
        { "text": "string (Subject line 1, personalized, <50 chars, include emoji suggestion like '✨')", "emoji": true/false },
        { "text": "string (Subject line 2, urgent variation)", "emoji": true/false },
        { "text": "string (Subject line 3, benefit-focused variation)", "emoji": true/false },
        { "text": "string (Subject line 4, question-based variation)", "emoji": true/false },
        { "text": "string (Subject line 5, curiosity-driven variation)", "emoji": true/false }
      ],
      "previewText": "string (Compelling preview text, <100 chars)",
      "emailBodyHtml": "string (Full HTML-friendly, mobile-responsive email content. Include personalized greeting, relevant product recommendations based on Product Focus and Customer Insights, compelling value proposition, social proof/testimonials if applicable, and clear call-to-action sections. Use placeholders like {{customer_name}} for personalization.)",
      "ctas": {
        "primary": { "text": "string (e.g., Shop Now, Learn More)", "link": "#product-link" },
        "secondary": { "text": "string (e.g., Explore Collection, Read Blog Post)", "link": "#secondary-link" },
        "urgencyDriven": [{ "text": "string (e.g., Limited Time Offer!, Get 20% Off - Ends Soon!)", "link": "#promo-link" }]
      },
      "personalizationNotes": ["string (Key customization elements used or suggested, e.g., 'Dynamic product block based on browsing history', 'Location-based offer for {{city}}')"]
    }
    Ensure the output is ONLY the JSON object. The emailBodyHtml should be a single string containing valid HTML.
  `;
  return generateContent<EmailContentResponse>(apiKey, prompt);
};

export const optimizeSendTime = async (
  input: SendTimeOptimizationInput,
  apiKey: string
): Promise<SendTimeOptimizationResponse | null> => {
  const prompt = `
    Analyze customer engagement patterns and recommend optimal send times. Provide output as a JSON object.
    Customer Engagement Data:
    - Historical open times: ${input.historicalOpenTimes}
    - Time zone: ${input.timeZone}
    - Device usage: ${input.deviceUsage}
    ${input.industry ? `- Industry: ${input.industry}` : ''}
    - Engagement patterns: ${input.engagementPatterns}
    - Campaign Type: ${input.campaignType}

    Generate a JSON object with the following structure:
    {
      "optimalSendDayTime": "string (e.g., 'Tuesday, 10:00 AM Local Time')",
      "reasoning": "string (Detailed explanation for the primary recommendation)",
      "alternativeOptions": ["string (e.g., 'Thursday, 2:00 PM Local Time for mid-week test')"],
      "timeZoneConsiderations": "string (How to handle multiple time zones if applicable)",
      "frequencyRecommendations": "string (e.g., 'Bi-weekly for this segment', 'Weekly for newsletters')",
      "seasonalAdjustments": "string (Suggestions for seasonal changes, if any)",
      "preferenceBasedVariations": "string (How to vary based on explicit user preferences)",
      "testingStrategy": "string (A/B test different send times, gradual optimization approach)",
      "performanceTrackingMetrics": ["string (e.g., 'Open Rate', 'Click-Through Rate by send time')"]
    }
    Ensure the output is ONLY the JSON object.
  `;
  return generateContent<SendTimeOptimizationResponse>(apiKey, prompt);
};

export const analyzePerformance = async (
  input: CampaignMetricsInput,
  apiKey: string
): Promise<PerformanceAnalysisResponse | null> => {
  const prompt = `
    Analyze email campaign performance and provide optimization recommendations. Output as a JSON object.
    Campaign Metrics:
    - Open Rate: ${input.openRate}
    - Click-Through Rate: ${input.clickThroughRate}
    - Conversion Rate: ${input.conversionRate}
    - Unsubscribe Rate: ${input.unsubscribeRate}
    - Revenue Generated: ${input.revenueGenerated}
    - Delivery Rate: ${input.deliveryRate}
    ${input.segmentPerformance ? `- Segment Performance: ${input.segmentPerformance}` : ''}
    ${input.abTestResults ? `- A/B Test Results: ${JSON.stringify(input.abTestResults)}` : ''}

    Generate a JSON object with the following structure:
    {
      "performanceSummary": "string (Overall campaign performance summary)",
      "keyWins": ["string (Positive aspects and successes)"],
      "areasForImprovement": ["string (Areas needing attention)"],
      "benchmarkComparisons": "string (Comparison to industry benchmarks, if possible to infer)",
      "roiAnalysis": "string (Return on Investment analysis based on data)",
      "optimizationRecommendations": {
        "subjectLine": ["string (Suggestions for subject line improvements)"],
        "content": ["string (Content adjustment ideas)"],
        "timing": ["string (Send time optimization tips based on results)"],
        "segmentation": ["string (Segmentation refinement strategies)"]
      },
      "nextCampaignStrategy": {
        "winningElements": ["string (Elements from this campaign to replicate)"],
        "newTestingOpportunities": ["string (New A/B tests to try)"],
        "audienceExpansion": ["string (Ideas for audience growth)"]
      },
      "automatedFollowUpSequences": {
        "converters": "string (Strategy for those who converted)",
        "nonOpeners": "string (Strategy for re-engaging non-openers)",
        "engagedNonConverters": "string (Strategy for those who clicked but didn't convert)"
      }
    }
    Ensure the output is ONLY the JSON object.
  `;
  return generateContent<PerformanceAnalysisResponse>(apiKey, prompt);
};

export const recommendProducts = async (
  input: ProductRecommendationInput,
  apiKey: string
): Promise<ProductRecommendationResponse | null> => {
  const prompt = `
    Based on customer data and business goals, generate personalized product recommendations. Output as JSON.
    Customer Profile: ${input.customerProfile}
    Available Products: ${input.availableProducts}
    ${input.currentInventory ? `Current Inventory: ${input.currentInventory}` : ''}
    Business Goals: ${input.businessGoals}

    Generate a JSON object with the following structure:
    {
      "primaryRecommendations": [
        { "name": "string (Product Name)", "reasoning": "string (Why this product is recommended)", "category": "string (Optional)", "price": "string (Optional, e.g. '$XX.XX')" } 
        // 3-5 primary recommendations
      ],
      "crossSellOpportunities": [
        { "name": "string (Product/Bundle Name)", "reasoning": "string (Why this cross-sell makes sense)", "category": "string (Optional)", "price": "string (Optional)" }
      ],
      "seasonalTrendingItems": [
        { "name": "string (Product Name)", "reasoning": "string (Why it's timely/trending)", "category": "string (Optional)", "price": "string (Optional)" }
      ]
    }
    Ensure the output is ONLY the JSON object. Include 3-5 primary recommendations.
  `;
  return generateContent<ProductRecommendationResponse>(apiKey, prompt);
};

export const generateEmailSequence = async (
  input: EmailSequenceInput,
  apiKey: string
): Promise<EmailSequenceResponse | null> => {
  const prompt = `
    Create an automated email sequence. Output as a JSON object.
    Sequence Type: ${input.sequenceType}
    Customer Trigger: ${input.customerTrigger}
    Business Goal: ${input.businessGoal}
    Sequence Length: ${input.sequenceLength}

    For each email in the sequence, define timing, subject line, content focus, CTA, personalization, and exit conditions.
    Generate a JSON object with the following structure:
    {
      "sequenceName": "string (e.g., 'Welcome Series for New Subscribers')",
      "emails": [
        {
          "timing": "string (e.g., 'Immediately after trigger', '1 hour after trigger', 'Day 2')",
          "subjectLine": "string (Personalized and sequence-appropriate subject)",
          "contentFocus": "string (Key message and value proposition for this email)",
          "cta": "string (Primary call-to-action for this email, e.g., 'Complete Your Profile', 'Shop Bestsellers')",
          "personalization": ["string (e.g., '{{customer_name}}', '{{last_viewed_product}}')"],
          "exitConditions": "string (Optional: When to remove customer from this sequence, e.g., 'If purchase made')"
        }
        // Add more email objects as per sequenceLength
      ]
    }
    Ensure the output is ONLY the JSON object. Create an appropriate number of emails for the specified sequence length.
    Example for Abandoned Cart (if type is Abandoned Cart):
    Email 1 (1 hour): "Forgot something, {{customer_name}}?" - Gentle reminder of cart items. CTA: "Return to Cart".
    Email 2 (24 hours): "Still thinking it over? Others love these!" - Social proof + items, urgency. CTA: "View Your Cart".
    Email 3 (72 hours): "Last chance for your items + a little something extra!" - Discount offer + scarcity. CTA: "Claim Discount & Shop".
  `;
  return generateContent<EmailSequenceResponse>(apiKey, prompt);
};

export default {
  getGeneralAiResponse,
  analyzeCustomerData,
  generateEmailContent,
  optimizeSendTime,
  analyzePerformance,
  recommendProducts,
  generateEmailSequence,
};
