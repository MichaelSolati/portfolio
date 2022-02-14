require('dotenv').config();
const CacheAsset = require('@11ty/eleventy-cache-assets');
const about = require('./about.json');
const webp = require('../../tools/webp');

module.exports = async () => {
  const videos = [];

  if (about.youtubePlaylist && process.env.YOUTUBE) {
    const playlist = await CacheAsset(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=24&playlistId=${about.youtubePlaylist}&key=${process.env.YOUTUBE}`,
      {
        duration: '6h',
        type: 'json',
      }
    ).catch(() => {
      throw new Error(
        `Error fetching JSON for YouTube Playlist: ${about.youtubePlaylist}`
      );
    });

    for (const video of playlist.items) {
      const src = Object.values(video.snippet.thumbnails)
        .sort((a, b) => a.width - b.width)
        .pop().url;
      const srcData = await webp(src, 'youtube');

      videos.push({
        title: video.snippet.title,
        description: video.snippet.description,
        url: `https://youtu.be/${video.contentDetails.videoId}`,
        date: video.contentDetails.videoPublishedAt,
        ...srcData,
      });
    }
  }

  return videos;
};
