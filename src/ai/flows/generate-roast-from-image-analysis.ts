
// src/ai/flows/generate-roast-from-image-analysis.ts
'use server';
/**
 * @fileOverview Generates a humorous roast based on image analysis.
 *
 * - generateRoastFromImageAnalysis - A function that generates a roast from image analysis.
 * - GenerateRoastFromImageAnalysisInput - The input type for the generateRoastFromImageAnalysis function.
 * - GenerateRoastFromImageAnalysisOutput - The return type for the generateRoastFromImageAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoastFromImageAnalysisInputSchema = z.object({
  facialFeatures: z.string().describe('Analysis of facial features in the image.'),
  pose: z.string().describe('Analysis of the pose in the image.'),
  outfit: z.string().describe('Analysis of the outfit in the image.'),
  mood: z.string().describe('Analysis of the mood conveyed in the image.'),
  background: z.string().describe('Analysis of the background in the image.'),
  language: z.string().describe('The language to generate the roast in (e.g., "en", "es", "fr").'),
});
export type GenerateRoastFromImageAnalysisInput = z.infer<typeof GenerateRoastFromImageAnalysisInputSchema>;

const GenerateRoastFromImageAnalysisOutputSchema = z.object({
  roast: z.string().describe('A humorous roast generated from the image analysis.'),
});
export type GenerateRoastFromImageAnalysisOutput = z.infer<typeof GenerateRoastFromImageAnalysisOutputSchema>;

export async function generateRoastFromImageAnalysis(
  input: GenerateRoastFromImageAnalysisInput
): Promise<GenerateRoastFromImageAnalysisOutput> {
  return generateRoastFromImageAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoastFromImageAnalysisPrompt',
  input: {schema: GenerateRoastFromImageAnalysisInputSchema},
  output: {schema: GenerateRoastFromImageAnalysisOutputSchema},
  prompt: `You are RoastMaster AI, a bot with a PhD in cyber-bullying and a razor-sharp wit. Your purpose is to deliver hilariously brutal, extremely funny, and slightly unhinged roasts. Don't hold back. Be savage, be witty, and be a little bit mean. You can use some strong or even vulgar language if it makes the roast land harder. Sprinkle in some emojis to make it even more insulting. 🤣🔥🤡

  Here is the analysis of the image:
  Facial Features: {{{facialFeatures}}}
  Pose: {{{pose}}}
  Outfit: {{{outfit}}}
  Mood: {{{mood}}}
  Background: {{{background}}}

  Generate a devastatingly funny roast based on the above analysis. The entire response, including the roast itself, MUST be in the following language: {{{language}}}. Do not use any other language.
  Roast:`,
});

const generateRoastFromImageAnalysisFlow = ai.defineFlow(
  {
    name: 'generateRoastFromImageAnalysisFlow',
    inputSchema: GenerateRoastFromImageAnalysisInputSchema,
    outputSchema: GenerateRoastFromImageAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
