'use client';

import {useTransitionRouter} from 'next-view-transitions';
import React from 'react';

import {cn} from '@/lib/utils';

export type AnimationType = 'scale' | 'slide-up' | 'slide-down' | 'none';

interface TransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
  animation?: AnimationType;
}

function isViewTransitionSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return 'startViewTransition' in document;
}

const TransitionLink = ({
  href,
  children,
  animation = 'none',
  className,
  ...props
}: TransitionLinkProps) => {
  const router = useTransitionRouter();
  const isExternal = href.startsWith('http');
  const isSupported = isViewTransitionSupported();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isExternal || animation === 'none' || !isSupported) {
      return;
    }

    e.preventDefault();
    router.push(href, {
      onTransitionReady: getAnimationFunction(animation),
    });
  };

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn('group block text-foreground h-full', className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export {TransitionLink};

function getAnimationFunction(animation: AnimationType): () => void {
  switch (animation) {
    case 'scale':
      return scale;
    case 'slide-up':
      return slideUp;
    case 'slide-down':
      return slideDown;
    default:
      return () => {};
  }
}

function scale() {
  if (typeof document === 'undefined' || !isViewTransitionSupported()) return; // SSR safety

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'scale(1)',
      },
      {
        opacity: 0,
        transform: 'scale(0.95)',
      },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    },
  );

  document.documentElement.animate(
    [
      {
        opacity: 0,
        transform: 'scale(1.05)',
      },
      {
        opacity: 1,
        transform: 'scale(1)',
      },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    },
  );
}

function slideUp() {
  if (typeof document === 'undefined' || !isViewTransitionSupported()) return; // SSR safety

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translateY(0)',
      },
      {
        opacity: 0,
        transform: 'translateY(-100%)',
      },
    ],
    {
      duration: 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    },
  );

  document.documentElement.animate(
    [
      {
        opacity: 0,
        transform: 'translateY(100%)',
      },
      {
        opacity: 1,
        transform: 'translateY(0)',
      },
    ],
    {
      duration: 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    },
  );
}

function slideDown() {
  if (typeof document === 'undefined' || !isViewTransitionSupported()) return; // SSR safety

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translateY(0)',
      },
      {
        opacity: 0,
        transform: 'translateY(100%)',
      },
    ],
    {
      duration: 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    },
  );

  document.documentElement.animate(
    [
      {
        opacity: 0,
        transform: 'translateY(-100%)',
      },
      {
        opacity: 1,
        transform: 'translateY(0)',
      },
    ],
    {
      duration: 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    },
  );
}
