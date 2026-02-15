'use server';
/**
 * @fileOverview A Genkit flow for generating a schedule of smart reminders for crop management.
 *
 * - generateReminders - A function that creates a weekly reminder schedule.
 */

import {ai} from '@/ai/genkit';
import { SmartRemindersInput, SmartRemindersInputSchema, SmartRemindersOutput, SmartRemindersOutputSchema } from '@/ai/schemas';

export async function generateReminders(input: SmartRemindersInput): Promise<SmartRemindersOutput> {
  return smartRemindersFlow(input);
}

const smartRemindersPrompt = ai.definePrompt({
  name: 'smartRemindersPrompt',
  input: {schema: SmartRemindersInputSchema},
  output: {schema: SmartRemindersOutputSchema},
  prompt: `You are an expert agronomist providing a task schedule for a farmer. Based on the crop, planting date, and location, create a 12-week schedule of essential tasks like watering, fertilizing, and pest control.

The schedule should be practical and easy to follow.

### Farmer's Input:
- Crop: {{{crop}}}
- Planting Date: {{{plantingDate}}}
- Location: {{{location}}}

### Your 12-Week Reminder Schedule:`,
});

const smartRemindersFlow = ai.defineFlow(
  {
    name: 'smartRemindersFlow',
    inputSchema: SmartRemindersInputSchema,
    outputSchema: SmartRemindersOutputSchema,
  },
  async input => {
    const {output} = await smartRemindersPrompt(input);
    return output!;
  }
);
