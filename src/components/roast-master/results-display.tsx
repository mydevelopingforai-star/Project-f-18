
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Flame, Share2, Twitter } from "lucide-react";
import { type RoastState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/language-provider";

type ResultsDisplayProps = {
  state: RoastState;
  onReset: () => void;
};

const getVibeEmoji = (rating: number): string => {
  if (rating <= 2) return "🤡"; // Clown face
  if (rating <= 4) return "🤨"; // Face with raised eyebrow
  if (rating <= 6) return "😐"; // Neutral face
  if (rating <= 8) return "😏"; // Smirking face
  return "😎"; // Smiling face with sunglasses
};

export function ResultsDisplay({ state, onReset }: ResultsDisplayProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  if (!state.imageUrl || !state.vibe || !state.roast || !state.comment) {
    return null;
  }
  
  const shareText = t('shareText', {
    emoji: getVibeEmoji(state.vibe),
    vibe: state.vibe,
    roast: state.roast.substring(0, 100)
  });
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
    window.open(twitterUrl, '_blank');
  }

  return (
    <div className="w-full max-w-5xl animate-in fade-in-0 duration-500">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
        <div className="flex items-center justify-center">
            <Image
              src={state.imageUrl}
              alt={t('userSubmissionAlt')}
              width={512}
              height={512}
              className="rounded-2xl object-cover aspect-square shadow-2xl w-full max-w-sm md:max-w-none"
            />
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold">
                <span className="text-3xl md:text-4xl">{getVibeEmoji(state.vibe)}</span>
                {t('vibeCheck')}: {state.vibe}/10
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="flex-1 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Flame className="text-primary" /> {t('theRoast')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base md:text-lg leading-relaxed">{state.roast}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Bot className="text-accent" /> {t('aiTwoCents')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-md italic text-muted-foreground">
                &quot;{state.comment}&quot;
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onReset} variant="outline" size="lg" className="w-full sm:w-auto">
          {t('roastAnother')}
        </Button>
        <Button onClick={handleTwitterShare} size="lg" className="w-full sm:w-auto">
            <Twitter />
            {t('postOnX')}
        </Button>
      </div>
    </div>
  );
}
