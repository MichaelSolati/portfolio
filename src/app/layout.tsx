import './globals.css';

import {Fira_Code, Space_Grotesk} from 'next/font/google';
import {ViewTransitions} from 'next-view-transitions';

import {Analytics} from '@/components/layout/analytics';
import {Navbar} from '@/components/layout/navbar';
import {ThemeProvider} from '@/components/layout/theme-provider';
import {GlassLayer} from '@/components/ui/glass-layer';
import {SummarizerWidget} from '@/components/ui/summarizer-widget';
import {generatePageMetadata} from '@/lib/metadata';
import {cn} from '@/lib/utils';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-fira-code',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
});

export const metadata = await generatePageMetadata({pathname: '/'});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            'font-body antialiased bg-background',
            firaCode.variable,
            spaceGrotesk.variable,
          )}
          suppressHydrationWarning
        >
          <GlassLayer />
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
          <SummarizerWidget />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
