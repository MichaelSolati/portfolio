import {NextResponse} from 'next/server';

import {generateRssFeed} from '@/lib/rss';

export const dynamic = 'force-static';

export async function GET() {
  const rss = generateRssFeed();

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
