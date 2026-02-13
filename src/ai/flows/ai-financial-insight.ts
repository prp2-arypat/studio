'use server';
/**
 * @fileOverview This file implements a Genkit flow that generates a personalized
 * AI-driven financial explanation based on simulated financial decisions.
 *
 * - getAIFinancialInsight - A function that handles the AI explanation generation process.
 * - AIFinancialInsightInput - The input type for the getAIFinancialInsight function.
 * - AIFinancialInsightOutput - The return type for the getAIFinancialInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIFinancialInsightInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  totalEmiAfterDecision: z.number().describe('Total EMIs after the new financial decision.'),
  stressRatio: z.number().describe('The financial stress ratio (Total EMI / Monthly Income).'),
  retirementCorpusBefore: z.number().describe('Projected retirement corpus before the new decision.'),
  retirementCorpusAfter: z.number().describe('Projected retirement corpus after the new decision.'),
  retirementDelay: z.number().describe('Calculated delay in retirement due to the decision, in years.'),
});
export type AIFinancialInsightInput = z.infer<typeof AIFinancialInsightInputSchema>;

const AIFinancialInsightOutputSchema = z.string().describe('A personalized AI-generated financial explanation.');
export type AIFinancialInsightOutput = z.infer<typeof AIFinancialInsightOutputSchema>;

export async function getAIFinancialInsight(input: AIFinancialInsightInput): Promise<AIFinancialInsightOutput> {
  return aiFinancialInsightFlow(input);
}

const aiFinancialInsightPrompt = ai.definePrompt({
  name: 'aiFinancialInsightPrompt',
  input: {schema: AIFinancialInsightInputSchema},
  output: {schema: AIFinancialInsightOutputSchema},
  prompt: `You are a supportive, non-judgmental financial advisor. Based on the following financial data, provide a personalized explanation of the impact of the user's financial decision on their retirement. Your explanation should be easy for a 16-year-old to understand, be limited to 200 words, and cover the following points:
1. A simple explanation of the financial situation in human language.
2. The emotional impact this decision might have.
3. An explanation of the risk level associated with this decision.
4. One practical, safer alternative the user could consider.

User Financial Data:
Income: ₹{{{income}}}
Total EMI After Decision: ₹{{{totalEmiAfterDecision}}}
Stress Ratio: {{{stressRatio}}}
Retirement Corpus Before: ₹{{{retirementCorpusBefore}}}
Retirement Corpus After: ₹{{{retirementCorpusAfter}}}
Retirement Delay: {{{retirementDelay}}} years`,
});

const aiFinancialInsightFlow = ai.defineFlow(
  {
    name: 'aiFinancialInsightFlow',
    inputSchema: AIFinancialInsightInputSchema,
    outputSchema: AIFinancialInsightOutputSchema,
  },
  async input => {
    const {text} = await aiFinancialInsightPrompt(input);
    if (!text) {
      throw new Error('AI did not return a valid explanation.');
    }
    return text;
  }
);
