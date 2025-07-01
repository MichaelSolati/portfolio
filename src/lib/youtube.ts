import {unstable_cache} from 'next/cache';

import {siteConfig} from '@/config/site';

type YouTubeVideoResponse = {
  contentDetails: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      url: string;
      width: number;
    }[];
  };
};

export type YouTubeVideo = {
  key: string;
  title: string;
  description: string;
  url: string;
  hero: string;
};

async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  const playlistId = siteConfig.handles.youtubePlaylistId;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=24&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }

    const videos = await response.json();

    return videos.items.map((video: YouTubeVideoResponse) => {
      const src = Object.values(video.snippet?.thumbnails ?? {})
        .sort((a, b) => a.width - b.width)
        .pop()?.url;

      return {
        key: video.contentDetails.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        url: `https://www.youtube.com/watch?v=${video.contentDetails.videoId}`,
        hero: src,
      };
    });
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    return [];
  }
}

export const getYouTubeVideos = unstable_cache(
  fetchYouTubeVideos,
  ['youtube-videos'],
  {
    revalidate: 86400, // 24 hours
    tags: ['youtube-videos'],
  },
);
