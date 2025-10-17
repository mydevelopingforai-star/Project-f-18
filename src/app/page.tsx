
"use client";

import RoastPage from "@/components/roast-master/roast-page";
import { LanguageSwitcher } from "@/components/roast-master/language-switcher";
import { useLanguage } from "@/i18n/language-provider";
import { useEffect, useState } from "react";
import { AnimatedParticles } from "@/components/roast-master/animated-particles";

function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        setDisplayedText((prev) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedText((prev) => text.substring(0, prev.length + 1));
      }

      if (!isDeleting && displayedText === text) {
        // Pause at the end
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setWordIndex(0); // Reset to start over
      }
    };
    
    const typingSpeed = isDeleting ? 50 : 100;
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, words, wordIndex]);

  return <span className="typewriter-cursor">{displayedText}</span>;
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto flex min-h-dvh flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <AnimatedParticles />
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <header className="w-full max-w-2xl text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {t('title')}
          </h1>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto min-h-[56px] md:min-h-[64px]">
            <Typewriter text={t('subtitle')} />
          </p>
        </header>
        <RoastPage />
      </div>
    </main>
  );
}
