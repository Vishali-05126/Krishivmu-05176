'use server';
/**
 * @fileOverview A Genkit flow for analyzing market data for agricultural produce.
 *
 * - analyzeMarkets - A function that provides market insights.
 */

import {ai} from '@/ai/genkit';
import { MarketAnalysisInput, MarketAnalysisInputSchema, MarketAnalysisOutput, MarketAnalysisOutputSchema } from '@/ai/schemas';

export async function analyzeMarkets(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  return marketAnalysisFlow(input);
}

const marketAnalysisPrompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  input: {schema: MarketAnalysisInputSchema},
  output: {schema: MarketAnalysisOutputSchema},
  prompt: `You are an expert market analyst for agricultural produce. Your task is to identify the top 3 wholesale markets near the user's location to sell their crop for the highest profit.

For each market, provide its name, location, an estimated profit margin or price trend, and a sample wholesale buyer contact.

### User's Input:
- Crop: {{{crop}}}
- Location: {{{location}}}

### Your Market Analysis:`,
});

const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async input => {
    const {output} = await marketAnalysisPrompt(input);
    return output!;
  }
);
