'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-code-explanation.ts';
import '@/ai/flows/ai-generate-css.ts';
import '@/ai/flows/farmer-exchange-flow.ts';
import '@/ai/flows/smart-reminders-flow.ts';
import '@/ai/flows/equipment-rental-flow.ts';
import '@/ai/flows/land-marketplace-flow.ts';
import '@/ai/flows/gov-scheme-flow.ts';
