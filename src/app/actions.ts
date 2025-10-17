
"use server";

import { ai } from "@/ai/genkit";
import { generateAiCommentPunchline } from "@/ai/flows/generate-ai-comment-punchline";
import { generateRoastFromImageAnalysis } from "@/ai/flows/generate-roast-from-image-analysis";
import { rateImageVibe } from "@/ai/flows/rate-image-vibe";
import { z } from "zod";

export type RoastState = {
  imageUrl?: string;
  roast?: string;
  vibe?: number;
  comment?: string;
  error?: string;
};

const ImageAnalysisInputSchema = z.object({
  photoDataUri: z.string(),
});

const ImageAnalysisOutputSchema = z.object({
  facialFeatures: z.string().describe("Analysis of facial features in the image."),
  pose: z.string().describe("Analysis of the pose in the image."),
  outfit: z.string().describe("Analysis of the outfit in the image."),
  mood: z.string().describe("Analysis of the mood conveyed in the image."),
  background: z.string().describe("Analysis of the background in the image."),
});

const analysisPrompt = ai.definePrompt({
  name: "roastMasterImageAnalyzer",
  input: { schema: ImageAnalysisInputSchema },
  output: {
    format: "json",
    schema: ImageAnalysisOutputSchema,
  },
  prompt: `You are an AI assistant with a sharp eye for detail and a sarcastic sense of humor. Analyze the following image.
  
  Image: {{media url=photoDataUri}}
  
  Provide a JSON object with your analysis covering the person's:
  - "facialFeatures": What stands out? Are they smiling, frowning, or just existing?
  - "pose": How are they standing or sitting? Is it a power pose or a "please-don't-take-my-picture" pose?
  - "outfit": What are they wearing? Describe the style, colors, and any notable items. Is it fashion-forward or a fashion faux pas?
  - "mood": What is the overall mood or vibe of the person in the image? Confident, awkward, happy, trying-too-hard?
  - "background": What's happening in the background? Is it a messy room, a scenic landscape, or a boring wall?
  
  Be descriptive and slightly judgmental in your analysis descriptions.`,
});

export async function getRoast(
  prevState: RoastState,
  formData: FormData
): Promise<RoastState> {
  const imageFile = formData.get("image") as File;
  const language = (formData.get("language") as string) || "en";

  if (!imageFile || imageFile.size === 0) {
    return { error: "Please select an image to upload." };
  }

  // Validate file size (e.g., 4MB limit)
  if (imageFile.size > 4 * 1024 * 1024) {
    return { error: 'Image file is too large. Please upload an image under 4MB.' };
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(imageFile.type)) {
    return { error: 'Invalid file type. Please upload a JPG, PNG, or WEBP image.' };
  }

  const buffer = await imageFile.arrayBuffer();
  const photoDataUri = `data:${imageFile.type};base64,${Buffer.from(
    buffer
  ).toString("base64")}`;

  try {
    // Step 1: Get structured analysis of the image
    const analysisResponse = await analysisPrompt({ photoDataUri });
    const analysis = analysisResponse.output;

    if (!analysis) {
      throw new Error(
        "AI analysis failed. The AI is probably too scared to roast you. Try another image."
      );
    }
    
    // Step 2: Concurrently get vibe rating, roast, and comment
    const [vibeResult, roastResult, commentResult] = await Promise.all([
      rateImageVibe({ photoDataUri }),
      generateRoastFromImageAnalysis({ ...analysis, language }),
      generateAiCommentPunchline({
        analysis: `Facial Features: ${analysis.facialFeatures}. Pose: ${analysis.pose}. Outfit: ${analysis.outfit}. Mood: ${analysis.mood}. Background: ${analysis.background}.`,
        language,
      }),
    ]);
    
    return {
      imageUrl: photoDataUri,
      vibe: vibeResult.vibeRating,
      roast: roastResult.roast,
      comment: commentResult.comment,
    };
  } catch (e: any) {
    console.error("Error in getRoast action:", e);
    if (e.message?.includes('503 Service Unavailable')) {
      return {
        error: "The AI is a bit overwhelmed right now (it's very popular). Please try again in a moment.",
      }
    }
    return {
      error: e.message || "An unexpected error occurred. The AI might be on a coffee break.",
    };
  }
}
