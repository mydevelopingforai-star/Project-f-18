
'use server';
/**
 * @fileOverview Generates a short, punchy AI comment based on image analysis.
 *
 * - generateAiCommentPunchline - A function that generates the AI comment punchline.
 * - GenerateAiCommentPunchlineInput - The input type for the generateAiCommentPunchline function.
 * - GenerateAiCommentPunchlineOutput - The return type for the generateAiCommentPunchline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiCommentPunchlineInputSchema = z.object({
  analysis: z
    .string()
    .describe("The image analysis result including facial features, pose, outfit, mood, and background."),
  language: z.string().describe('The language to generate the comment in (e.g., "en", "es", "fr").'),
});
export type GenerateAiCommentPunchlineInput = z.infer<typeof GenerateAiCommentPunchlineInputSchema>;

const GenerateAiCommentPunchlineOutputSchema = z.object({
  comment: z.string().describe('A short, punchy AI-generated comment.'),
});
export type GenerateAiCommentPunchlineOutput = z.infer<typeof GenerateAiCommentPunchlineOutputSchema>;

export async function generateAiCommentPunchline(
  input: GenerateAiCommentPunchlineInput
): Promise<GenerateAiCommentPunchlineOutput> {
  return generateAiCommentPunchlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiCommentPunchlinePrompt',
  input: {schema: GenerateAiCommentPunchlineInputSchema},
  output: {schema: GenerateAiCommentPunchlineOutputSchema},
  prompt: `You are an AI that generates a final, devastatingly funny punchline based on image analysis. This is your last chance to stick the knife in and twist it.

  Image Analysis: {{{analysis}}}

  Generate a 1-2 line comment that's extremely sarcastic, witty, and maybe a little insulting. Be uncensored.
  The entire response, including the comment itself, MUST be in the following language: {{{language}}}. Do not use any other language.
  Comment:`,
});

const generateAiCommentPunchlineFlow = ai.defineFlow(
  {
    name: 'generateAiCommentPunchlineFlow',
    inputSchema: GenerateAiCommentPunchlineInputSchema,
    outputSchema: GenerateAiCommentPunchlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
