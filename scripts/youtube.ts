import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import * as prompts from 'prompts';
const rimraf = require('rimraf');

import { cleanText, saveImagetoWebP, writeDataTs } from './utils'

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
          const youtubeAssetsPath = path.join('src', 'assets', 'youtube');
          rimraf.sync(youtubeAssetsPath);
          fs.mkdirSync(youtubeAssetsPath);

          const videos = [];

          for (let video of playlist.items) {
            const filename = `${video.contentDetails.videoId}.webp`;
            const thumbnail = (Object.values(video.snippet.thumbnails) as any[]).sort((a, b) => a.width - b.width).pop().url;
            try {
              await saveImagetoWebP(thumbnail, path.join(youtubeAssetsPath, filename));
            } catch { }
            const src = `./assets/youtube/${filename}`;

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
