require('dotenv').config();
import * as prompts from 'prompts';
import fetch from 'node-fetch';
import { createWriteStream, readFileSync, writeFileSync, mkdirSync } from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { tmpdir } from 'os';
const webp = require('webp-converter');
const streamPipeline = require('util').promisify(require('stream').pipeline)
const scrollToBottom = require('scroll-to-bottomjs');
const JSDOM = require('jsdom').JSDOM;
const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const rimraf = require('rimraf');
const { SitemapStream, streamToPromise } = require('sitemap');

import { environment } from './src/environments/environment.prod';

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

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const cleanText = (text: string = ''): string => {
  const regexRemoveMultipleSpaces = / +/g
  const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm

  return (text || '')
    .replace(regexRemoveLineBreaks, '')
    .replace(regexRemoveMultipleSpaces, ' ')
    .replace('...', '')
    .replace('See more', '')
    .replace('See less', '')
    .trim();
};

const writeDataTs = (folder: string, json: any): void => {
  const appFolder = path.join('src', 'app', folder, 'data.ts');
  const file = `const data = ${JSON.stringify(json, null, '\t')};\nexport default data;`;
  writeFileSync(appFolder, file);
};

const saveImagetoWebP = (src: string, saveTo: string): Promise<void> => {
  const toWebP = (input, output, extension?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (extension && extension === 'gif') {
        webp.gwebp(input, output, '-q 50', (s) => (s === '100') ? resolve(input) : reject())
      } else {
        webp.cwebp(input, output, '-q 50', (s) => (s === '100') ? resolve(input) : reject());
      }
    });
  };
  return fetch(src).then(async (response) => {
    if (!response.ok) throw new Error();
    const extension = response.headers.get('content-type').split('/').pop();
    const fileName = `image.${extension}`;
    const tempProfilePath = path.join(tmpdir(), fileName);
    await streamPipeline(response.body, createWriteStream(tempProfilePath));
    return toWebP(tempProfilePath, saveTo, extension);
  });
}

const defaultData = {};

(async () => {
  // sitemap
  const sitemapLinks = Object.keys(environment.pages)
    .filter((key) => environment.pages[key].enabled || key === 'home')
    .map((key) => ({
      url: (environment.pages[key].path === '') ? '/' : '/' + environment.pages[key].path,
      changefreq: 'weekly',
      priority: key === 'home' ? 1 : 0.8
    }));
  const sitemapStream = new SitemapStream({ hostname: environment.site.baseURL });
  sitemapLinks.forEach(link => sitemapStream.write(link));
  sitemapStream.end();
  const sitemap = await streamToPromise(sitemapStream).then(data => data.toString());
  writeFileSync(path.join('src', 'sitemap.xml'), sitemap);

  // webmanifest
  if (environment.site.name) {
    console.log('Updating `manifest.webmanifest`s');
    ['manifest.webmanifest', 'manifest.dark.webmanifest'].forEach((fileName) => {
      const filePath = path.join('src', fileName);
      const manifest = JSON.parse(readFileSync(filePath, 'utf8'));
      manifest.name = environment.site.name;
      manifest.short_name = environment.site.short_name;
      writeFileSync(filePath, JSON.stringify(manifest, null, '\t'));
    });
    console.log('Updated `manifest.webmanifest`s');
  }

  // dev.to
  if (accounts.devto) {
    console.log('Fetching dev.to posts');
    const res = await fetch(`https://dev.to/api/articles?username=${accounts.devto}`);
    try {
      let posts = await res.json();
      const devtoAssetsPath = path.join('src', 'assets', 'devto');
      rimraf.sync(devtoAssetsPath);
      mkdirSync(devtoAssetsPath);

      const parsed = [];

      posts = posts.filter(() => posts.type_of !== 'article')
        .sort((a, b) => (new Date(b.published_at).getTime() - new Date(a.published_at).getTime()))
        .slice(0, 24)

      for (let post of posts) {
        const filename = `${post.slug}.webp`;
        const thumbnail = post.cover_image || post.social_image;
        try {
          await saveImagetoWebP(thumbnail, path.join(devtoAssetsPath, filename));
        } catch { }
        const src = `./assets/devto/${filename}`;

        parsed.push({
          title: post.title,
          description: post.description,
          url: post.url,
          src,
          date: post.published_at,
        });
      }

      writeDataTs('devto', parsed);
      console.log('Saved dev.to posts');
    } catch {
      console.log('Could not save dev.to posts.')
    }

    console.log('Getting profile picture from dev.to');
    await fetch(`https://dev.to/${accounts.devto}`)
      .then(res => res.text())
      .then(async html => {
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const image = document.querySelector('img.profile-pic');
        const src = image.getAttribute('src').replace('h_320', 'h_1000').replace('w_320', 'w_1000');
        const tempProfilePath = await saveImagetoWebP(src, path.join('src', 'assets', 'profile.webp'));
        defaultData['image'] = './assets/profile.webp';
        console.log('Saved dev.to profile picture.');

        const iconsPath = path.join('src', 'assets', 'icons');
        const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];
        pwaSizes.forEach(async (px) => {
          await sharp(tempProfilePath).resize({ height: px, width: px }).toFile(path.join(iconsPath, `icon-${px}x${px}.png`));
        });

        const png = readFileSync(path.join(iconsPath, 'icon-72x72.png'));
        await pngToIco(png).then(buf => {
          writeFileSync(path.join('src', 'favicon.ico'), buf);
        });
      })
      .catch(() => {
        console.log('Could not save dev.to profile picture.')
      });
  } else {
    writeDataTs('devto', []);
  }

  // GitHub
  if (accounts.github) {
    console.log('Fetching GitHub repos.');
    await fetch(`https://api.github.com/users/${accounts.github}/repos`)
      .then(res => res.json())
      .then(repos => {
        if (Array.isArray(repos)) {
          repos = repos
            .filter(r => !r.archived)
            .sort((a, b) => (
              b.stargazers_count - a.stargazers_count ||
              (new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            ))
            .slice(0, 24)
            .map((repo) => ({
              title: repo.name,
              description: repo.description,
              url: repo.html_url,
              date: repo.updated_at,
            }));

          writeDataTs('github', repos);
          console.log('Saved GitHub repos.');
        }
      })
      .catch(() => console.log('Could not save GitHub repos.'));
  } else {
    writeDataTs('github', []);
  }

  // LinkedIn
  if (accounts.linkedin.email) {
    // Get LinkedIn password if needed
    if (!skipPrompts && accounts.linkedin.email && !accounts.linkedin.password) {
      const response = await prompts({
        type: 'password',
        name: 'password',
        message: 'What is your LinkedIn password?'
      });

      accounts.linkedin.password = response.password;
    }

    if (accounts.linkedin.password) {
      console.log('Fetching LinkedIn profile.');
      const profileUrl = `https://www.linkedin.com/in/${accounts.linkedin.profile}/`;
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36';
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      const profile = {};

      try {
        await page.setUserAgent(userAgent);
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });
        await page.$('#username').then((e) => e.type(accounts.linkedin.email));
        await page.$('#password').then((e) => e.type(accounts.linkedin.password));
        await page.$x("//button[contains(text(), 'Sign in')]").then((button) => button[0].click());
        await sleep(2000);
        await page.goto(profileUrl, { waitUntil: 'networkidle2' });
        await page.evaluate(scrollToBottom);
        await sleep(2000);
        await page.$('a.lt-line-clamp__more').then((e) => e.click());
        const expandButtonsSelectors = [
          '.lt-line-clamp__more',
          '#experience-section button.pv-profile-section__see-more-inline',
          '#education-section button.pv-profile-section__see-more-inline',
          'section.volunteering-section button.pv-profile-section__see-more-inline'
        ];
        for (const buttonSelector of expandButtonsSelectors) {
          if (await page.$(buttonSelector) !== null) {
            await page.click(buttonSelector);
          }
        }
        await sleep(2000);
        const html = await page.content();
        await browser.close();

        const dom = new JSDOM(html);
        const document = dom.window.document;

        // START PROFILE
        const profileSection = document.querySelector('.pv-top-card');

        const fullNameElement = profileSection?.querySelector('.pv-top-card--list li:first-child');
        profile['fullName'] = fullNameElement?.textContent || null;

        const titleElement = profileSection?.querySelector('h2');
        profile['title'] = titleElement?.textContent || null;

        const locationElement = profileSection?.querySelector('.pv-top-card--list.pv-top-card--list-bullet.mt1 li:first-child');
        profile['location'] = locationElement?.textContent || null;

        const descriptionElement = document.querySelector('.pv-about__summary-text .lt-line-clamp__raw-line');
        profile['description'] = descriptionElement?.textContent || null;
        // END PROFILE

        profile['experiences'] = [];

        const homeAssetsPath = path.join('src', 'assets', 'home');
        rimraf.sync(homeAssetsPath);
        mkdirSync(homeAssetsPath);

        // START WORK EXPERIENCE
        const workExperiences: any[] = Array.from(document.querySelector('#experience-section').querySelector('ul').children).slice(0, 6);
        for (let i = 0; i < workExperiences.length; i++) {
          const experience = workExperiences[i];

          const titleElement = experience.querySelector('h3');
          const title = titleElement?.textContent || null;

          const srcElement = experience.querySelector('img.pv-entity__logo-img');
          const srcAttr = srcElement?.getAttribute('src') || null;
          let src = null;
          if (srcAttr.includes('http')) {
            const filename = `work-${i}.webp`;
            try {
              await saveImagetoWebP(srcAttr, path.join(homeAssetsPath, filename));
            } catch { }
            src = `./assets/home/${filename}`;
          }

          const companyElement = experience.querySelector('.pv-entity__secondary-title');
          const companyElementClean = companyElement && companyElement?.querySelector('span') ? companyElement?.removeChild(companyElement.querySelector('span') as Node) && companyElement : companyElement || null;
          const company = companyElementClean?.textContent || null;

          const descriptionElement = experience.querySelector('.pv-entity__description');
          const description = descriptionElement?.textContent || null;

          const dateRangeElement = experience.querySelector('.pv-entity__date-range span:nth-child(2)');
          const dateRangeText = dateRangeElement?.textContent || null;

          const startPart = dateRangeText?.split('–')[0] || null;
          const start = startPart?.trim() || null;

          const endPart = dateRangeText?.split('–')[1] || null;
          const current = endPart?.trim().toLowerCase() === 'present' || false;
          const end = (endPart && !current) ? endPart.trim() : 'Present';

          profile['experiences'].push({
            title: cleanText(title),
            src,
            institution: cleanText(company),
            start: new Date(cleanText(start)),
            end: new Date(cleanText(end)),
            current,
            description: cleanText(description),
            icon: 'business',
            type: 'work'
          });
        }
        // END EXPERIENCE

        // START EDUCATION EXPERIENCE
        const educationExperiences: any[] = Array.from(document.querySelector('#education-section').querySelector('ul').children).slice(0, 6);
        for (let i = 0; i < educationExperiences.length; i++) {
          const experience = educationExperiences[i];

          const schoolElement = experience.querySelector('h3.pv-entity__school-name');
          const school = schoolElement?.textContent || null;

          const srcElement = experience.querySelector('img.pv-entity__logo-img');
          const srcAttr = srcElement?.getAttribute('src') || null;
          let src = null;
          if (srcAttr.includes('http')) {
            const filename = `education-${i}.webp`;
            try {
              await saveImagetoWebP(srcAttr, path.join(homeAssetsPath, filename));
            } catch { }
            src = `./assets/home/${filename}`;
          }

          const degreeElement = experience.querySelector('.pv-entity__degree-name .pv-entity__comma-item');
          const degree = degreeElement?.textContent || null;

          const fieldElement = experience.querySelector('.pv-entity__fos .pv-entity__comma-item');
          const field = fieldElement?.textContent || null;

          const dateRangeElement = experience.querySelectorAll('.pv-entity__dates time');

          const startPart = dateRangeElement && dateRangeElement[0]?.textContent || null;
          const start = startPart || null

          const endPart = dateRangeElement && dateRangeElement[1]?.textContent || null;
          const current = endPart?.trim().toLowerCase() === 'present' || false;
          const end = endPart || null

          profile['experiences'].push({
            title: cleanText(degree),
            src,
            institution: cleanText(school),
            start: new Date(cleanText(start)),
            end: new Date(cleanText(end)),
            current,
            description: cleanText(field),
            icon: 'school',
            type: 'education'
          });
        }
        // END EDUCATION

        // START VOLUNTEER EXPERIENCE
        const volunteerExperiences: any[] = Array.from(document.querySelector('.volunteering-section').querySelector('ul').children).slice(0, 6);
        for (let i = 0; i < volunteerExperiences.length; i++) {
          const experience = volunteerExperiences[i];

          const titleElement = experience.querySelector('h3');
          const title = titleElement?.textContent || null;

          const srcElement = experience.querySelector('img.pv-entity__logo-img');
          const srcAttr = srcElement?.getAttribute('src') || null;
          let src = null;
          if (srcAttr.includes('http')) {
            const filename = `volunteer-${i}.webp`;
            try {
              await saveImagetoWebP(srcAttr, path.join(homeAssetsPath, filename));
            } catch { }
            src = `./assets/home/${filename}`;
          }

          const companyElement = experience.querySelector('.pv-entity__secondary-title');
          const companyElementClean = companyElement && companyElement?.querySelector('span') ? companyElement?.removeChild(companyElement.querySelector('span') as Node) && companyElement : companyElement || null;
          const company = companyElementClean?.textContent || null;

          const descriptionElement = experience.querySelector('.pv-entity__description');
          const description = descriptionElement?.textContent || null;

          const dateRangeElement = experience.querySelector('.pv-entity__date-range span:nth-child(2)');
          const dateRangeText = dateRangeElement?.textContent || null;

          const startPart = dateRangeText?.split('–')[0] || null;
          const start = startPart?.trim() || null;

          const endPart = dateRangeText?.split('–')[1] || null;
          const current = endPart?.trim().toLowerCase() === 'present' || false;
          const end = (endPart && !current) ? endPart.trim() : 'Present';

          profile['experiences'].push({
            title: cleanText(title),
            src,
            institution: cleanText(company),
            start: new Date(cleanText(start)),
            end: new Date(cleanText(end)),
            current,
            description: cleanText(description),
            icon: 'group',
            type: 'volunteer'
          });
        }
        // END VOLUNTEER

        profile['experiences'] = profile['experiences'].sort((a, b) => {
          if (b.current && a.current) {
            return (new Date(b.start).getTime() - new Date(a.start).getTime());
          } else if (b.current && !a.current) {
            return 1;
          } else if (!b.current && a.current) {
            return -1;
          } else {
            return (new Date(b.end).getTime() - new Date(a.end).getTime());
          }
        });

        for (let key in profile) {
          if (typeof profile[key] === 'string') {
            profile[key] = cleanText(profile[key]);
          }
        }

        writeDataTs('home', { ...profile, ...defaultData });

        console.log('Saved LinkedIn profile.');
      } catch (e) {
        console.log(e)
        console.log('Could not save LinkedIn profile.');
      }
    }
  } else {
    writeDataTs('home', defaultData);
  }

  // YouTube
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
          mkdirSync(youtubeAssetsPath);

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

  process.exit(0);
})();
