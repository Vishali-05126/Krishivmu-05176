'use server';
/**
 * @fileOverview A Genkit flow for generating a basic style.css file based on UI style preferences.
 *
 * - aiGenerateCSS - A function that generates CSS content.
 * - AIGenerateCSSInput - The input type for the aiGenerateCSS function.
 * - AIGenerateCSSOutput - The return type for the aiGenerateCSS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIGenerateCSSInputSchema = z.object({
  primaryColor: z
    .string()
    .describe('The primary color for the UI, e.g., #D0BFFF.'),
  backgroundColor: z
    .string()
    .describe('The background color for the UI, e.g., #F5F5F5.'),
  accentColor: z
    .string()
    .describe('The accent color for the UI, e.g., #A483B9.'),
  bodyFont: z.string().describe('The font family for body text, e.g., Inter.'),
  headlineFont: z
    .string()
    .describe('The font family for headlines, e.g., Inter.'),
});
export type AIGenerateCSSInput = z.infer<typeof AIGenerateCSSInputSchema>;

const AIGenerateCSSOutputSchema = z.object({
  cssContent: z.string().describe('The generated CSS content for style.css.'),
});
export type AIGenerateCSSOutput = z.infer<typeof AIGenerateCSSOutputSchema>;

export async function aiGenerateCSS(input: AIGenerateCSSInput): Promise<AIGenerateCSSOutput> {
  return aiGenerateCSSFlow(input);
}

const aiGenerateCSSPrompt = ai.definePrompt({
  name: 'aiGenerateCSSPrompt',
  input: {schema: AIGenerateCSSInputSchema},
  output: {schema: AIGenerateCSSOutputSchema},
  prompt: `You are an expert web designer assistant tasked with generating a basic 'style.css' file based on user-provided UI preferences. Your output should be a complete, well-formatted CSS string.

Generate CSS that incorporates the following styles:
-   A basic reset for margin and padding on common elements (body, h1-h6, p, ul, ol, li).
-   'body' styles including 'font-family' using '{{bodyFont}}' with a generic fallback, 'background-color' using '{{backgroundColor}}', and a default 'color' for text like #333. Include 'line-height: 1.6;'.
-   'h1' through 'h6' styles using 'font-family' as '{{headlineFont}}' with a generic fallback, 'color' as '{{primaryColor}}', and 'margin-bottom: 0.5em;'.
-   A '.button' class that uses '{{primaryColor}}' for 'background-color', white text, padding, no border, border-radius of 5px, and 'cursor: pointer;'.
-   A ':hover' state for '.button' that changes 'background-color' to '{{accentColor}}'.
-   A '.accent-text' class that sets 'color' to '{{accentColor}}'.

Ensure that all font names are enclosed in single quotes if they contain spaces, and always include a generic font family fallback like 'sans-serif'.

Return only the CSS content within the 'cssContent' field.

Example:
{
  "cssContent": "/* Generated CSS content goes here */"
}

Primary Color: {{{primaryColor}}}
Background Color: {{{backgroundColor}}}
Accent Color: {{{accentColor}}}
Body Font: {{{bodyFont}}}
Headline Font: {{{headlineFont}}}
`,
});

const aiGenerateCSSFlow = ai.defineFlow(
  {
    name: 'aiGenerateCSSFlow',
    inputSchema: AIGenerateCSSInputSchema,
    outputSchema: AIGenerateCSSOutputSchema,
  },
  async input => {
    const {output} = await aiGenerateCSSPrompt(input);
    return output!;
  }
);
