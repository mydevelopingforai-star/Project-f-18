'use server';
/**
 * @fileOverview This file defines a Genkit flow for rating the vibe of an image.
 *
 * It takes an image data URI as input and returns a vibe rating from 1 to 10, considering factors like confidence, expression, lighting, and pose.
 *
 * @exports rateImageVibe - The main function to call to rate the image vibe.
 * @exports RateImageVibeInput - The input type for the rateImageVibe function.
 * @exports RateImageVibeOutput - The output type for the rateImageVibe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RateImageVibeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type RateImageVibeInput = z.infer<typeof RateImageVibeInputSchema>;

const RateImageVibeOutputSchema = z.object({
  vibeRating: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe(
      'A rating from 1 to 10 indicating the overall vibe of the image, considering confidence, expression, lighting, and pose.'
    ),
});
export type RateImageVibeOutput = z.infer<typeof RateImageVibeOutputSchema>;

export async function rateImageVibe(input: RateImageVibeInput): Promise<RateImageVibeOutput> {
  return rateImageVibeFlow(input);
}

const rateImageVibePrompt = ai.definePrompt({
  name: 'rateImageVibePrompt',
  input: {schema: RateImageVibeInputSchema},
  output: {schema: RateImageVibeOutputSchema},
  prompt: `You are an AI image analysis expert. Your task is to analyze the vibe of an image and provide a rating from 1 to 10.

  Consider the following aspects when determining the vibe rating:
  - Confidence: How confident the subject(s) appear in the image.
  - Expression: The emotions conveyed through facial expressions.
  - Lighting: The quality and impact of the lighting in the image.
  - Pose: The posture and body language of the subject(s).

  Provide an overall vibe rating based on these factors. The rating should be a single integer between 1 and 10, where 1 is a very negative vibe and 10 is a very positive vibe.

  Image: {{media url=photoDataUri}}

  Vibe Rating:`,
});

const rateImageVibeFlow = ai.defineFlow(
  {
    name: 'rateImageVibeFlow',
    inputSchema: RateImageVibeInputSchema,
    outputSchema: RateImageVibeOutputSchema,
  },
  async input => {
    const {output} = await rateImageVibePrompt(input);
    return output!;
  }
);
