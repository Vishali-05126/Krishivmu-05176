'use server';
/**
 * @fileOverview This file implements a Genkit flow for explaining the interplay between HTML and CSS code.
 *
 * - aiCodeExplanation - A function that provides insights into how HTML components and CSS styles are interconnected.
 * - AICodeExplanationInput - The input type for the aiCodeExplanation function.
 * - AICodeExplanationOutput - The return type for the aiCodeExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICodeExplanationInputSchema = z.object({
  htmlContent: z
    .string()
    .describe('The HTML content to be analyzed, including its structure and elements.'),
  cssContent: z
    .string()
    .describe('The CSS content to be analyzed, including its styling rules.'),
});
export type AICodeExplanationInput = z.infer<typeof AICodeExplanationInputSchema>;

const AICodeExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed explanation of how HTML components are styled by the CSS, focusing on interdependencies via selectors, classes, and IDs.'
    ),
});
export type AICodeExplanationOutput = z.infer<typeof AICodeExplanationOutputSchema>;

export async function aiCodeExplanation(input: AICodeExplanationInput): Promise<AICodeExplanationOutput> {
  return aiCodeExplanationFlow(input);
}

const aiCodeExplanationPrompt = ai.definePrompt({
  name: 'aiCodeExplanationPrompt',
  input: {schema: AICodeExplanationInputSchema},
  output: {schema: AICodeExplanationOutputSchema},
  prompt: `You are an expert web developer assistant. Your task is to analyze the provided HTML and CSS code and explain how they are interconnected.
Focus on how CSS rules (e.g., using element selectors, class selectors, ID selectors) apply to and affect specific HTML elements.
Provide a clear and concise explanation, highlighting key relationships and dependencies between the HTML structure and the CSS styling.

### HTML Code:
\`\`\`html
{{{htmlContent}}}
\`\`\`

### CSS Code:
\`\`\`css
{{{cssContent}}}
\`\`\`

### Explanation:`,
});

const aiCodeExplanationFlow = ai.defineFlow(
  {
    name: 'aiCodeExplanationFlow',
    inputSchema: AICodeExplanationInputSchema,
    outputSchema: AICodeExplanationOutputSchema,
  },
  async input => {
    const {output} = await aiCodeExplanationPrompt(input);
    return output!;
  }
);
