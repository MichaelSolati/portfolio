import fetch from 'node-fetch';
import * as prompts from 'prompts';

import { cleanText, writeDataTs } from './utils'
import assetsStorage from './assets-storage';

export const generateYouTube = async (accounts, skipPrompts) => {
  if (accounts.youtube.playlist) {
    // Get YouTube API key if needed
    if (!skipPrompts && accounts.youtube.playlist && !accounts.youtube.apikey) {
      const response = await prompts({
        type: 'string',
        name: 'apikey',
        message: 'What is your Google/YouTube API key?'
      });

      accounts.youtube.apikey = response.apikey;
    }

    if (accounts.youtube.apikey) {
      console.log('Fetching YouTube videos.');
      const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=24&playlistId=${accounts.youtube.playlist}&key=${accounts.youtube.apikey}`);
      try {
        const playlist = await res.json();
        if (Array.isArray(playlist.items)) {
          assetsStorage.deleteFolder('youtube');
          assetsStorage.createFolder('youtube');

          const videos = [];

          for (let video of playlist.items) {
            const filename = `${video.contentDetails.videoId}`;
            const imgSrc = (Object.values(video.snippet.thumbnails) as any[]).sort((a, b) => a.width - b.width).pop().url;
            let src: string;
            try {
              src = (await assetsStorage.createImage(imgSrc, 'youtube', filename)).output;
            } catch { }

            videos.push({
              title: video.snippet.title,
              description: cleanText(video.snippet.description),
              url: `https://youtu.be/${video.contentDetails.videoId}`,
              src,
              date: video.contentDetails.videoPublishedAt,
            });
          }

          writeDataTs('youtube', videos);
          console.log('Saved YouTube videos.');
        }
      } catch {
        console.log('Could not save YouTube videos.')
      }
    }
  } else {
    writeDataTs('youtube', []);
  }
}
