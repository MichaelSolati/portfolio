'use client';

import {AlertTriangle, Bot, Loader2, Sparkles, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';

import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

const summarizerOptions: SummarizerCreateOptions = {
  sharedContext:
    'A general summary to help a quickly understand the content of the page',
  type: 'tldr',
  length: 'medium',
  format: 'plain-text',
};

export function SummarizerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const summarizerRef = useRef<Summarizer | null>(null);

  useEffect(() => {
    async function initSummarizer() {
      if (!('Summarizer' in self)) return;
      const availability = await Summarizer.availability();
      if (availability === 'unavailable') return;
      const summarizer = await Summarizer.create(summarizerOptions);
      setIsSupported(true);
      summarizerRef.current = summarizer;
    }

    if (typeof window !== 'undefined') {
      initSummarizer().catch(error => {
        console.error('Error initializing summarizer:', error);
      });
    }
  }, []);

  const handleSummarize = async () => {
    if (!summarizerRef.current) {
      setSummary('Summarizer is not available.');
      return;
    }
    setIsLoading(true);
    setSummary('');

    try {
      const content = document.querySelector('main')?.textContent || '';
      const stream = summarizerRef.current.summarizeStreaming(content);
      // @ts-expect-error - Matches MDN but throwing an error https://developer.mozilla.org/en-US/docs/Web/API/Summarizer/summarizeStreaming#basic_summarizestreaming_usage
      for await (const chunk of stream) {
        setSummary(t => t + chunk);
      }
    } catch {
      setSummary("Sorry, I couldn't summarize this page.");
    } finally {
      setIsLoading(false);
    }
  };

  const NotSupportedMessage = () => (
    <div className="text-center p-4 bg-muted rounded-lg flex flex-col items-center gap-2 h-full justify-center">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <p className="font-semibold text-foreground">Feature Not Supported</p>
      <p className="text-sm text-muted-foreground">
        The AI Summarizer is not available in your browser.
      </p>
    </div>
  );

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[999]">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Summarizer Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-primary-foreground" />
          ) : (
            <Bot className="w-6 h-6 text-primary-foreground" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          'fixed bottom-28 right-8 z-[999] w-full max-w-sm transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none',
        )}
      >
        <div className="bg-card text-card-foreground rounded-lg border shadow-2xl flex flex-col h-[500px]">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-headline font-semibold">
              Page Summarizer
            </h3>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {isSupported === null && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {isSupported === false && <NotSupportedMessage />}
            {isSupported === true &&
              (summary ? (
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {summary}
                </p>
              ) : (
                <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                  <p>Click the button below to generate a summary.</p>
                </div>
              ))}
          </div>
          {isSupported === true && (
            <div className="p-4 border-t">
              <Button
                onClick={handleSummarize}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Summarizing...' : 'Summarize This Page'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
