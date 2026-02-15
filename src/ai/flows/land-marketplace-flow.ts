'use server';
/**
 * @fileOverview A Genkit flow for a land marketplace.
 *
 * - findLandListings - A function that finds land listings.
 */

import {ai} from '@/ai/genkit';
import { LandMarketplaceInput, LandMarketplaceInputSchema, LandMarketplaceOutput, LandMarketplaceOutputSchema } from '@/ai/schemas';

export async function findLandListings(input: LandMarketplaceInput): Promise<LandMarketplaceOutput> {
  return landMarketplaceFlow(input);
}

const landMarketplacePrompt = ai.definePrompt({
  name: 'landMarketplacePrompt',
  model: 'gemini-1.5-flash-latest',
  input: {schema: LandMarketplaceInputSchema},
  output: {schema: LandMarketplaceOutputSchema},
  prompt: `You are an agricultural land marketplace platform. A user wants to buy, sell, or rent land.

Based on the user's request, generate 3 fictional land listings. Each listing should include the type (For Sale, For Rent), location, size in acres, an estimated price, and a fictional contact person.

### User's Request:
- Action: {{{action}}}
- Location: {{{location}}}
- Desired Size: {{{landSize}}}

### Your Top 3 Listings:`,
});

const landMarketplaceFlow = ai.defineFlow(
  {
    name: 'landMarketplaceFlow',
    inputSchema: LandMarketplaceInputSchema,
    outputSchema: LandMarketplaceOutputSchema,
  },
  async input => {
    const {output} = await landMarketplacePrompt(input);
    return output!;
  }
);
