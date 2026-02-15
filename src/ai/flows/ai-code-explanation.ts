'use server';
/**
 * @fileOverview A Genkit flow for recommending crops based on agricultural conditions.
 *
 * - planCrops - A function that suggests suitable crops.
 */

import {ai} from '@/ai/genkit';
import { CropPlannerInput, CropPlannerInputSchema, CropPlannerOutput, CropPlannerOutputSchema } from '@/ai/schemas';

export async function planCrops(input: CropPlannerInput): Promise<CropPlannerOutput> {
  return cropPlannerFlow(input);
}

const cropPlannerPrompt = ai.definePrompt({
  name: 'cropPlannerPrompt',
  model: 'gemini-1.5-flash-latest',
  input: {schema: CropPlannerInputSchema},
  output: {schema: CropPlannerOutputSchema},
  prompt: `You are an expert agronomist. Your task is to recommend the top 3 most suitable crops to plant based on the user's location, soil type, and the current month.

Provide practical and actionable recommendations. For each crop, give a concise reason and the best planting time.

### User's Input:
- Location: {{{location}}}
- Soil Type: {{{soilType}}}
- Month: {{{month}}}

### Your Recommendations:`,
});

const cropPlannerFlow = ai.defineFlow(
  {
    name: 'cropPlannerFlow',
    inputSchema: CropPlannerInputSchema,
    outputSchema: CropPlannerOutputSchema,
  },
  async input => {
    const {output} = await cropPlannerPrompt(input);
    return output!;
  }
);
