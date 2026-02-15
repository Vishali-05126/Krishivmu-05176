'use server';
/**
 * @fileOverview A Genkit flow for finding relevant government schemes for farmers.
 *
 * - findGovSchemes - A function that finds government schemes.
 */

import {ai} from '@/ai/genkit';
import { GovSchemeInput, GovSchemeInputSchema, GovSchemeOutput, GovSchemeOutputSchema } from '@/ai/schemas';

export async function findGovSchemes(input: GovSchemeInput): Promise<GovSchemeOutput> {
  return govSchemeFlow(input);
}

const govSchemePrompt = ai.definePrompt({
  name: 'govSchemePrompt',
  input: {schema: GovSchemeInputSchema},
  output: {schema: GovSchemeOutputSchema},
  prompt: `You are an expert on agricultural government schemes in India. Based on the user's location, crop, and category, find the top 3 most relevant government schemes.

Provide the scheme name, a brief description, the eligibility criteria, and an official link for more details.

### User's Details:
- Location: {{{location}}}
- Crop: {{{crop}}}
- Category: {{{category}}}

### Your Top 3 Scheme Recommendations:`,
});

const govSchemeFlow = ai.defineFlow(
  {
    name: 'govSchemeFlow',
    inputSchema: GovSchemeInputSchema,
    outputSchema: GovSchemeOutputSchema,
  },
  async input => {
    const {output} = await govSchemePrompt(input);
    return output!;
  }
);
