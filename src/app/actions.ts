'use server';

import { planCrops } from '@/ai/flows/ai-code-explanation';
import { analyzeMarkets } from '@/ai/flows/ai-generate-css';
import { findExchangeMatches } from '@/ai/flows/farmer-exchange-flow';
import { CropPlannerInput, CropPlannerOutput, FarmerExchangeInput, FarmerExchangeOutput, MarketAnalysisInput, MarketAnalysisOutput } from '@/ai/schemas';

export async function planCropsAction(input: CropPlannerInput): Promise<{ success: boolean; data?: CropPlannerOutput; error?: string }> {
  try {
    const result = await planCrops(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get crop plan from AI.' };
  }
}

export async function analyzeMarketsAction(input: MarketAnalysisInput): Promise<{ success: boolean; data?: MarketAnalysisOutput; error?: string }> {
  try {
    const result = await analyzeMarkets(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get market analysis from AI.' };
  }
}

export async function findExchangeMatchesAction(input: FarmerExchangeInput): Promise<{ success: boolean; data?: FarmerExchangeOutput; error?: string }> {
  try {
    const result = await findExchangeMatches(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to find matches from AI.' };
  }
}
