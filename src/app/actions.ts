'use server';

import { aiGenerateCSS } from '@/ai/flows/ai-generate-css';
import { aiCodeExplanation } from '@/ai/flows/ai-code-explanation';

export async function generateCssAction() {
  try {
    const result = await aiGenerateCSS({
      primaryColor: '#A483B9', // Muted Purple
      backgroundColor: '#F5F5F5', // Light Gray
      accentColor: '#D0BFFF', // Soft Lavender
      bodyFont: 'Inter',
      headlineFont: 'Inter',
    });
    return { success: true, css: result.cssContent };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate CSS from AI.' };
  }
}

export async function explainCodeAction(htmlContent: string, cssContent: string) {
  if (!htmlContent || !cssContent) {
    return { success: false, error: 'HTML and CSS content must be provided to get an explanation.' };
  }
  
  try {
    const result = await aiCodeExplanation({
      htmlContent,
      cssContent,
    });
    return { success: true, explanation: result.explanation };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get explanation from AI.' };
  }
}
