import {z} from 'zod';

// Schema for Crop Planner
export const CropPlannerInputSchema = z.object({
  location: z.string().describe('The geographical location (e.g., city, state, country) for planting.'),
  soilType: z.string().describe('The type of soil (e.g., Loamy, Sandy, Clay).'),
  month: z.string().describe('The month of the year for planting.'),
});
export type CropPlannerInput = z.infer<typeof CropPlannerInputSchema>;

export const CropPlannerOutputSchema = z.object({
  recommendations: z.array(z.object({
    crop: z.string().describe('The name of the recommended crop.'),
    reason: z.string().describe('The reason why this crop is recommended for the given conditions.'),
    plantingTime: z.string().describe('The ideal time or period within the month to plant the crop.'),
  })).describe('A list of crop recommendations.'),
});
export type CropPlannerOutput = z.infer<typeof CropPlannerOutputSchema>;


// Schema for Market Analysis
export const MarketAnalysisInputSchema = z.object({
  crop: z.string().describe('The crop for which market analysis is required (e.g., "Tomatoes").'),
  location: z.string().describe('The current location of the user to find nearby markets (e.g., "Nashik, Maharashtra").'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

export const MarketAnalysisOutputSchema = z.object({
  markets: z.array(z.object({
    marketName: z.string().describe('The name of the wholesale market.'),
    location: z.string().describe('The location of the market.'),
    profitMargin: z.string().describe('An estimated profit margin or current price trend, e.g., "15-20% higher than local average".'),
    contact: z.string().describe('A fictional or sample contact person and phone number for the wholesale buyer.'),
  })).describe('A list of recommended markets.'),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

// Schema for Farmer to Farmer Exchange
export const FarmerExchangeInputSchema = z.object({
  haveCrop: z.string().describe('The crop the farmer has and wants to exchange.'),
  wantCrop: z.string().describe('The crop the farmer wants to receive in exchange.'),
  location: z.string().describe('The location of the farmer to find nearby matches.'),
});
export type FarmerExchangeInput = z.infer<typeof FarmerExchangeInputSchema>;

export const FarmerExchangeOutputSchema = z.object({
  matches: z.array(z.object({
    farmerName: z.string().describe('A fictional name for the matching farmer.'),
    location: z.string().describe('The location of the matching farmer.'),
    contact: z.string().describe('A fictional contact number for the matching farmer.'),
    exchangeDetails: z.string().describe('Details of what the matching farmer is offering and wanting.'),
  })).describe('A list of potential farmer exchange matches.'),
});
export type FarmerExchangeOutput = z.infer<typeof FarmerExchangeOutputSchema>;

// Schema for Smart Reminders
export const SmartRemindersInputSchema = z.object({
  crop: z.string().describe('The crop for which to generate reminders.'),
  plantingDate: z.string().describe('The date the crop was planted, in YYYY-MM-DD format.'),
  location: z.string().describe('The geographical location of the farm.'),
});
export type SmartRemindersInput = z.infer<typeof SmartRemindersInputSchema>;

export const SmartRemindersOutputSchema = z.object({
  reminders: z.array(z.object({
    week: z.number().describe('The week number after planting (e.g., 1, 2, 3).'),
    task: z.string().describe('The main task for the week (e.g., "Watering", "Fertilizing", "Pest Control").'),
    details: z.string().describe('Specific details and recommendations for the task.'),
  })).describe('A schedule of weekly reminders.'),
});
export type SmartRemindersOutput = z.infer<typeof SmartRemindersOutputSchema>;
