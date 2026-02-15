'use server';

import { planCrops } from '@/ai/flows/ai-code-explanation';
import { analyzeMarkets } from '@/ai/flows/ai-generate-css';
import { CropPlannerInput, CropPlannerInputSchema, CropPlannerOutput, MarketAnalysisInput, MarketAnalysisOutput } from '@/ai/schemas';

export async function planCropsAction(input: CropPlannerInput): Promise<{ success: boolean; data?: CropPlannerOutput; error?: string }> {
  const parsedInput = CropPlannerInputSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: 'Invalid input.' };
  }
  
  try {
    const result = await planCrops(parsedInput.data);
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
