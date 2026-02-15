'use server';
/**
 * @fileOverview A Genkit flow for analyzing market data for agricultural produce.
 *
 * - analyzeMarkets - A function that provides market insights.
 * - MarketAnalysisInput - The input type for the analyzeMarkets function.
 * - MarketAnalysisOutput - The return type for the analyzeMarkets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
