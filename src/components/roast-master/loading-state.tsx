"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/language-provider";

export function LoadingState() {
  const { t } = useLanguage();
  const loadingMessages = t('loadingMessages');
  const [messageIndex, setMessageIndex] = useState(0);
  const [emoji, setEmoji] = useState("😏");

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000);

    const emojiEmojis = ["😱", "😈"];
    let i = 0;
    const emojiInterval = setInterval(() => {
        setEmoji(emojiEmojis[i % emojiEmojis.length]);
        i++;
    }, 500);

    return () => {
        clearInterval(messageInterval);
        clearInterval(emojiInterval)
    };
  }, [loadingMessages.length]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-md h-96 rounded-lg border-2 border-dashed border-border bg-card/50 relative overflow-hidden">
      <div className="scanline"></div>
      <div className="text-6xl mb-6 animate-pulse">{emoji}</div>
      <p className="text-xl font-medium text-foreground">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
}
