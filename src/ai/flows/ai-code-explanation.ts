'use server';
/**
 * @fileOverview A Genkit flow for recommending crops based on agricultural conditions.
 *
 * - planCrops - A function that suggests suitable crops.
 * - CropPlannerInput - The input type for the planCrops function.
 * - CropPlannerOutput - The return type for the planCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function planCrops(input: CropPlannerInput): Promise<CropPlannerOutput> {
  return cropPlannerFlow(input);
}

const cropPlannerPrompt = ai.definePrompt({
  name: 'cropPlannerPrompt',
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
