'use server';
/**
 * @fileOverview A Genkit flow for finding equipment rentals.
 *
 * - findEquipmentRentals - A function that finds potential equipment rental providers.
 */

import {ai} from '@/ai/genkit';
import { EquipmentRentalInput, EquipmentRentalInputSchema, EquipmentRentalOutput, EquipmentRentalOutputSchema } from '@/ai/schemas';

export async function findEquipmentRentals(input: EquipmentRentalInput): Promise<EquipmentRentalOutput> {
  return equipmentRentalFlow(input);
}

const equipmentRentalPrompt = ai.definePrompt({
  name: 'equipmentRentalPrompt',
  model: 'gemini-1.5-flash-latest',
  input: {schema: EquipmentRentalInputSchema},
  output: {schema: EquipmentRentalOutputSchema},
  prompt: `You are an agricultural equipment rental directory. The user is looking for a specific tool or machinery in their area.

Generate 3 fictional rental providers near the user's location. For each provider, include a name, address, contact number, and an estimated daily rental price.

### User's Request:
- Tool/Machinery: {{{tool}}}
- Location: {{{location}}}

### Your Top 3 Rental Providers:`,
});

const equipmentRentalFlow = ai.defineFlow(
  {
    name: 'equipmentRentalFlow',
    inputSchema: EquipmentRentalInputSchema,
    outputSchema: EquipmentRentalOutputSchema,
  },
  async input => {
    const {output} = await equipmentRentalPrompt(input);
    return output!;
  }
);
