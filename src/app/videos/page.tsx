import {RetroCard} from '@/components/ui/retro-card';
import {siteConfig} from '@/config/site';
import {generatePageMetadata} from '@/lib/metadata';
import {getYouTubeVideos} from '@/lib/youtube';

export const metadata = await generatePageMetadata({pathname: '/videos'});

export default async function VideosPage() {
  const videos = await getYouTubeVideos();

  return (
    <div className="container pt-24 pb-32">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          My Talks
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {siteConfig.nav['/videos'].description}
        </p>
      </header>

      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {videos.map(video => (
          <RetroCard
            key={video.key}
            href={video.url}
            imageUrl={video.hero}
            imageAlt={video.title}
            title={video.title}
            imageHint="YouTube thumbnail"
          />
        ))}
      </div>
    </div>
  );
}
