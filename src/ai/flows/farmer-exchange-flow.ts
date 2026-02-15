'use server';
/**
 * @fileOverview A Genkit flow for matching farmers for crop exchanges.
 *
 * - findExchangeMatches - A function that finds potential crop exchange matches.
 */

import {ai} from '@/ai/genkit';
import { FarmerExchangeInput, FarmerExchangeInputSchema, FarmerExchangeOutput, FarmerExchangeOutputSchema } from '@/ai/schemas';

export async function findExchangeMatches(input: FarmerExchangeInput): Promise<FarmerExchangeOutput> {
  return farmerExchangeFlow(input);
}

const farmerExchangePrompt = ai.definePrompt({
  name: 'farmerExchangePrompt',
  input: {schema: FarmerExchangeInputSchema},
  output: {schema: FarmerExchangeOutputSchema},
  prompt: `You are an expert agricultural exchange platform. Your task is to find 3 potential matches for a farmer wanting to exchange crops.

The user has provided what crop they have, what crop they want, and their location. You need to generate a list of other (fictional) farmers who have the desired crop and might be interested in the user's crop.

For each match, provide a fictional name, location (near the user's location), a contact number, and the details of their offer.

### User's Exchange Offer:
- Has: {{{haveCrop}}}
- Wants: {{{wantCrop}}}
- Location: {{{location}}}

### Your Top 3 Matches:`,
});

const farmerExchangeFlow = ai.defineFlow(
  {
    name: 'farmerExchangeFlow',
    inputSchema: FarmerExchangeInputSchema,
    outputSchema: FarmerExchangeOutputSchema,
  },
  async input => {
    const {output} = await farmerExchangePrompt(input);
    return output!;
  }
);
