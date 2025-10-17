
"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getRoast, type RoastState } from "@/app/actions";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "./loading-state";
import { ResultsDisplay } from "./results-display";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/i18n/language-provider";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: RoastState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();
  const [emoji, setEmoji] = useState("😏");

  useEffect(() => {
    if (pending) {
      const emojis = ["😱", "😈"];
      let i = 0;
      const interval = setInterval(() => {
        setEmoji(emojis[i % emojis.length]);
        i++;
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setEmoji("😏");
    }
  }, [pending]);

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full font-bold text-lg"
    >
      {pending ? (
        <>
          <span className="w-6 h-6 inline-block">{emoji}</span>
          {t('roasting')}
        </>
      ) : (
        t('roastMe')
      )}
    </Button>
  );
}

export default function RoastPage() {
  const [state, formAction, isPending] = useActionState(getRoast, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (state.error && !isPending) {
      toast({
        variant: "destructive",
        title: t('roastFailed'),
        description: state.error,
      });
    }
  }, [state, toast, t, isPending]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
            variant: "destructive",
            title: t('imageTooLargeTitle'),
            description: t('imageTooLargeDesc'),
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    window.location.reload();
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (state.imageUrl && !state.error) {
    return <ResultsDisplay state={state} onReset={resetForm} />;
  }

  return (
    <form action={formAction} className="w-full max-w-md z-10">
      <input type="hidden" name="language" value={language} />
      <div className="space-y-6">
        <div className="aspect-square w-full">
            <label
              htmlFor="image-upload"
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 border-dashed border-border transition-all duration-300 cursor-pointer bg-card/50",
                "hover:border-primary hover:shadow-[0_0_20px_5px] hover:shadow-primary/20"
              )}
            >
            {imagePreview ? (
                <>
                <Image
                    src={imagePreview}
                    alt={t('imagePreviewAlt')}
                    fill
                    className="object-contain rounded-2xl p-2"
                />
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 md:top-4 md:right-4 z-10 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setImagePreview(null);
                      if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                      }
                    }}
                >
                    <X className="h-4 w-4" />
                </Button>
                </>
            ) : (
                <div className="text-center p-4 md:p-8">
                    <UploadCloud className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold text-foreground text-base md:text-lg">
                        {t('uploadMessage')}
                    </p>
                    <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                        {t('uploadHint')}
                    </p>
                </div>
            )}
            <input
                id="image-upload"
                name="image"
                type="file"
                ref={fileInputRef}
                className="sr-only"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                required
            />
            </label>
        </div>
        
        {state.error && !isPending && (
            <Alert variant="destructive">
                <AlertTitle>{t('roastFailed')}</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}

        <SubmitButton />
      </div>
    </form>
  );
}
