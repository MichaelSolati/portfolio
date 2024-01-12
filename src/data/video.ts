import "dotenv/config";
import EleventyFetch from "@11ty/eleventy-fetch";

import { environment } from "../environment";
import type { Props as CardProps } from '../components/Card';

export default async function Video(): Promise<CardProps[]> {
  const elements: CardProps[] = [];

  if (environment.youtubePlaylist) {
    const videos: any = await EleventyFetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=24&playlistId=${environment.youtubePlaylist.id}&key=${process.env.YOUTUBE}`,
      {
        duration: "6h",
        type: "json",
      }
    ).catch(() => {
      throw new Error(
        `Error fetching JSON for YouTube Playlist: ${environment.youtubePlaylist.id}`
      );
    });

    for (let video of videos.items) {
      const src = (Object.values(video.snippet.thumbnails) as any[])
        .sort((a, b) => a.width - b.width)
        .pop().url;

      elements.push({
        title: video.snippet.title,
        description: video.snippet.description,
        url: `https://youtu.be/${video.contentDetails.videoId}`,
        hero: src,
      });
    }
  }

  return elements;
}