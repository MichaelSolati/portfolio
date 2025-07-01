'use client';

import * as LucideIcons from 'lucide-react';
import {usePathname} from 'next/navigation';
import {useCallback, useEffect, useRef, useState} from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {TransitionLink} from '@/components/ui/transition-link';
import {siteConfig} from '@/config/site';
import {useIsMobile} from '@/hooks/use-mobile';
import {useMounted} from '@/hooks/use-mounted';
import {cn} from '@/lib/utils';

import {ThemeToggle} from './theme-toggle';

export function Navbar() {
  const currentPath = usePathname();
  const isMobile = useIsMobile();
  const mounted = useMounted();

  const [currentActiveIndex, setCurrentActiveIndex] = useState<number | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);

  const navItems = Object.entries(siteConfig.nav);

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return currentPath === '/';
      return currentPath.startsWith(href);
    },
    [currentPath],
  );

  const getAnimation = () => {
    const isSubPath = currentPath.split('/').length > 2;
    return isSubPath ? 'slide-down' : 'scale';
  };

  // Update active index when path changes
  useEffect(() => {
    const newActiveIndex = navItems.findIndex(([href]) => isActive(href));

    if (newActiveIndex !== currentActiveIndex) {
      setCurrentActiveIndex(newActiveIndex);

      if (currentActiveIndex !== null && newActiveIndex !== -1) {
        setIsAnimating(true);
        // Reset animation state after animation completes
        setTimeout(() => setIsAnimating(false), 300);
      }
    }
  }, [currentPath, currentActiveIndex, navItems, isActive]);

  // Helper to recalculate highlight
  const recalculateHighlight = useCallback(() => {
    if (currentActiveIndex === null || !containerRef.current) return;
    const container = containerRef.current;
    const navElements = container.querySelectorAll('a');
    const activeElement = navElements[currentActiveIndex];
    if (!activeElement) return;
    const containerRect = container.getBoundingClientRect();
    const elementRect = activeElement.getBoundingClientRect();
    const isIconOnly = navItems[currentActiveIndex][0] === '/';
    const left = elementRect.left - containerRect.left;
    const top = elementRect.top - containerRect.top;
    const width = elementRect.width;
    const height = elementRect.height;

    if (isIconOnly) {
      const size = Math.max(width, height);
      setHighlightStyle({
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        transition: isAnimating
          ? 'left 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out'
          : 'none',
      });
    } else {
      setHighlightStyle({
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '9999px',
        transition: isAnimating
          ? 'left 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out'
          : 'none',
      });
    }
  }, [currentActiveIndex, isAnimating, navItems]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new window.ResizeObserver(() => {
      recalculateHighlight();
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [recalculateHighlight, isMobile]);

  return (
    <nav
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
      style={{viewTransitionName: 'navbar'}}
    >
      <TooltipProvider>
        <div
          ref={containerRef}
          className="flex items-center gap-2 rounded-full bg-card/80 p-2 border border-border/50 backdrop-blur-md shadow-lg relative"
        >
          {/* Sliding highlight */}
          {currentActiveIndex !== null && (
            <div
              className="bg-primary pointer-events-none"
              style={{...highlightStyle, zIndex: 1}}
            />
          )}

          {navItems.map(([href, item]) => {
            const active = isActive(href);
            const animation = getAnimation();
            const isIconOnlyButton = href === '/';
            const showTooltip = isIconOnlyButton || (mounted && isMobile);
            const IconComponent = (
              LucideIcons as unknown as Record<
                string,
                React.ComponentType<React.SVGProps<SVGSVGElement>>
              >
            )[item.icon as keyof typeof LucideIcons];

            const linkElement = (
              <TransitionLink
                key={href}
                href={href}
                animation={animation}
                aria-label={item.title}
                className={cn(
                  'relative rounded-full text-sm font-medium transition-colors flex items-center justify-center z-10',
                  active
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                  href === '/' ? 'h-10 w-10' : 'h-10 w-10 md:w-auto md:px-4',
                )}
              >
                {href === '/' ? (
                  IconComponent ? (
                    <IconComponent className="w-5 h-5" />
                  ) : null
                ) : (
                  <>
                    {IconComponent ? (
                      <IconComponent className="w-5 h-5 md:hidden" />
                    ) : null}
                    <span className="hidden md:inline">{item.title}</span>
                  </>
                )}
              </TransitionLink>
            );

            if (showTooltip) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger>{linkElement}</TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8}>
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkElement;
          })}
          <ThemeToggle />
        </div>
      </TooltipProvider>
    </nav>
  );
}
