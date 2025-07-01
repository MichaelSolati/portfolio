import Image from 'next/image';
import React from 'react';

import {cn} from '@/lib/utils';

import {TransitionLink} from './transition-link';

interface RetroCardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  imageHint?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const RetroCard = ({
  href,
  title,
  imageUrl,
  imageAlt,
  imageHint,
  description,
  children,
  footer,
  className,
  ...props
}: RetroCardProps) => {
  const cardContent = (
    <div className="flex flex-col h-full">
      <div className="flex-grow transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:rotate-1">
        <div className="border-2 border-primary rounded-md overflow-hidden bg-slate-800 transition-shadow duration-300 group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)] h-full flex flex-col">
          {/* Window Header */}
          <div className="h-8 flex items-center px-2 border-b-2 border-primary bg-slate-900/50 shrink-0">
            <div className="w-3 h-3 border-2 border-primary rounded-sm mr-1.5"></div>
            <div className="w-3 h-3 border-2 border-primary rounded-sm mr-1.5"></div>
            <div className="w-3 h-3 border-2 border-primary rounded-sm"></div>
          </div>

          {/* Content Area */}
          <div className="flex-grow">
            {imageUrl && imageAlt ? (
              <div className="aspect-[4/3] relative bg-slate-950">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={imageHint}
                />
              </div>
            ) : (
              <div className="p-6 text-primary/80 h-full flex flex-col">
                <div className="flex-grow">{description}</div>
                {footer !== undefined && (
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-primary/20">
                    {footer}
                  </div>
                )}
                {children}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title with decorative border */}
      <div className="mt-4 relative shrink-0">
        <div className="absolute -left-3 -top-1 w-6 h-6 border-l-2 border-t-2 border-primary/70 transition-colors group-hover:border-primary"></div>
        <h3 className="pl-6 font-headline text-lg group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );

  if (href) {
    return (
      <TransitionLink
        href={href}
        className={cn('group block text-foreground h-full', className)}
        animation={'slide-up'}
      >
        {cardContent}
      </TransitionLink>
    );
  }

  return (
    <div className={cn('group text-foreground h-full', className)} {...props}>
      {cardContent}
    </div>
  );
};

export {RetroCard};
