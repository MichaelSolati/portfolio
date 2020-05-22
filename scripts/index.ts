require('dotenv').config();

import { generateDevTo } from './devto';
import { generateGitHub } from './github';
import { generateLinkedIn } from './linkedin';
import { generateScreenshots } from './screenshots';
import { generateSitemap } from './sitemap';
import { generateWebmanifest } from './webmanifest';
import { generateYouTube } from './youtube';

import { environment } from '../src/environments/environment.prod';

const skipPrompts = (process.argv).find((a) => ['--skipPrompts', '-S'].includes(a));
const accounts = {
  devto: environment.pages.devto.username || process.env.DEVTO,
  github: environment.pages.github.username || process.env.GITHUB,
  linkedin: {
    profile: environment.pages.home.username || process.env.LINKEDIN_ACCOUNT,
    email: (environment.pages.home.username || process.env.LINKEDIN_ACCOUNT) && (environment.site.email || process.env.LINKEDIN_EMAIL),
    password: process.env.LINKEDIN_PASSWORD,
  },
  youtube: {
    playlist: environment.pages.youtube.playlist || process.env.YOUTUBE,
    apikey: environment.firebase.apiKey || process.env.YOUTUBE_APIKEY,
  }
};

const defaultData = {};

(async () => {
  // sitemap
  await generateSitemap(environment);
  // webmanifest
  await generateWebmanifest(environment);
  // dev.to
  await generateDevTo(accounts, defaultData);
  // GitHub
  await generateGitHub(accounts);
  // LinkedIn
  await generateLinkedIn(accounts, skipPrompts, defaultData);
  // YouTube
  await generateYouTube(accounts, skipPrompts);
  // screenshots
  await generateScreenshots();

  process.exit(0);
})();
