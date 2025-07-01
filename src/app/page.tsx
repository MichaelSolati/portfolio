import {Github, Linkedin, Twitter} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {TransitionLink} from '@/components/ui/transition-link';
import {siteConfig} from '@/config/site';
import {generatePageMetadata} from '@/lib/metadata';

export const metadata = await generatePageMetadata({pathname: '/'});

export default function HomePage() {
  return (
    <div className="container relative flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          Hi, my name is {siteConfig.name}!
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          {siteConfig.description}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <TransitionLink href="/about" animation="scale">
              About Me
            </TransitionLink>
          </Button>
          <Button variant="secondary" asChild>
            <TransitionLink href="/code" animation="scale">
              View Code
            </TransitionLink>
          </Button>
        </div>
        <div className="mt-12 flex justify-center gap-6">
          {siteConfig.handles.github && (
            <TransitionLink
              href={`https://github.com/${siteConfig.handles.github}`}
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
              <span className="sr-only">GitHub</span>
            </TransitionLink>
          )}
          {siteConfig.handles.twitter && (
            <TransitionLink
              href={`https://twitter.com/${siteConfig.handles.twitter}`}
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
              <span className="sr-only">Twitter</span>
            </TransitionLink>
          )}
          {siteConfig.handles.linkedin && (
            <TransitionLink
              href={`https://www.linkedin.com/in/${siteConfig.handles.linkedin}`}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
              <span className="sr-only">LinkedIn</span>
            </TransitionLink>
          )}
        </div>
      </div>
    </div>
  );
}
