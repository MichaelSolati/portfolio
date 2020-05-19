require('dotenv').config();
import * as prompts from 'prompts';
import fetch from 'node-fetch';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
const streamPipeline = require('util').promisify(require('stream').pipeline)
const scrollToBottom = require('scroll-to-bottomjs');
const JSDOM = require('jsdom').JSDOM;
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

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

const defaultData = {};

(async () => {
  // webmanifest
  if (environment.site.name) {
    console.log('Updating `manifest.webmanifest`s');
    ['manifest.webmanifest', 'manifest.dark.webmanifest'].forEach((fileName) => {
      const filePath = path.join('src', fileName);
      const manifest = JSON.parse(readFileSync(filePath, 'utf8'));
      manifest.name = environment.site.name;
      manifest.short_name = environment.site.name;
      writeFileSync(filePath, JSON.stringify(manifest, null, '\t'));
    });
    console.log('Updated `manifest.webmanifest`s');
  }

  // dev.to
  if (accounts.devto) {
    console.log('Fetching dev.to posts');
    await fetch(`https://dev.to/api/articles?username=${accounts.devto}`)
      .then(res => res.json())
      .then(posts => {
        posts = posts
          .filter(() => posts.type_of !== 'article')
          .sort((a, b) => (new Date(b.published_at).getTime() - new Date(a.published_at).getTime()))
          .slice(0, 24)
          .map((post) => ({
            title: post.title,
            description: post.description,
            url: post.url,
            src: post.cover_image || post.social_image,
            date: post.published_at,
          }));

        writeDataTs('devto', posts);
        console.log('Saved dev.to posts');
      })
      .catch(() => {
        console.log('Could not save dev.to posts.')
      });

    console.log('Getting profile picture from dev.to');
    await fetch(`https://dev.to/${accounts.devto}`)
      .then(res => res.text())
      .then(async html => {
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const image = document.querySelector('img.profile-pic');
        const src = image.getAttribute('src').replace('h_320', 'h_1000').replace('w_320', 'w_1000');
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error();
        }
        const fileName = `profile.${response.headers.get('content-type').split('/').pop()}`;
        const imagePath = path.join('src', 'assets', fileName);
        await streamPipeline(response.body, createWriteStream(imagePath));
        defaultData['image'] = fileName;
        console.log('Saved dev.to profile picture.');

        const iconsPath = path.join('src', 'assets', 'icons');
        const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];
        pwaSizes.forEach(async (px) => {
          await sharp(imagePath).resize({ height: px, width: px }).toFile(path.join(iconsPath, `icon-${px}x${px}.png`));
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

        // START EXPERIENCE
        const experience = document.querySelector('#experience-section').querySelector('ul').children;
        // Using a for loop so we can use await inside of it
        for (const node of experience) {
          const titleElement = node.querySelector('h3');
          const title = titleElement?.textContent || null;

          const srcElement = node.querySelector('img.pv-entity__logo-img');
          const src = srcElement?.getAttribute('src') || null;

          const companyElement = node.querySelector('.pv-entity__secondary-title');
          const companyElementClean = companyElement && companyElement?.querySelector('span') ? companyElement?.removeChild(companyElement.querySelector('span') as Node) && companyElement : companyElement || null;
          const company = companyElementClean?.textContent || null;

          const descriptionElement = node.querySelector('.pv-entity__description');
          const description = descriptionElement?.textContent || null;

          const dateRangeElement = node.querySelector('.pv-entity__date-range span:nth-child(2)');
          const dateRangeText = dateRangeElement?.textContent || null;

          const startPart = dateRangeText?.split('–')[0] || null;
          const start = startPart?.trim() || null;

          const endPart = dateRangeText?.split('–')[1] || null;
          const current = endPart?.trim().toLowerCase() === 'present' || false;
          const end = (endPart && !current) ? endPart.trim() : 'Present';

          profile['experiences'].push({
            title: cleanText(title),
            src: src.includes('http') ? src : null,
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

        // START EDUCATION
        const education = document.querySelector('#education-section').querySelector('ul').children;
        for (const node of education) {

          const schoolElement = node.querySelector('h3.pv-entity__school-name');
          const school = schoolElement?.textContent || null;

          const srcElement = node.querySelector('img.pv-entity__logo-img');
          const src = srcElement?.getAttribute('src') || null;

          const degreeElement = node.querySelector('.pv-entity__degree-name .pv-entity__comma-item');
          const degree = degreeElement?.textContent || null;

          const fieldElement = node.querySelector('.pv-entity__fos .pv-entity__comma-item');
          const field = fieldElement?.textContent || null;

          const dateRangeElement = node.querySelectorAll('.pv-entity__dates time');

          const startPart = dateRangeElement && dateRangeElement[0]?.textContent || null;
          const start = startPart || null

          const endPart = dateRangeElement && dateRangeElement[1]?.textContent || null;
          const current = endPart?.trim().toLowerCase() === 'present' || false;
          const end = endPart || null

          profile['experiences'].push({
            title: cleanText(degree),
            src: src.includes('http') ? src : null,
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

        // START VOLUNTEER
        const volunteering = document.querySelector('.volunteering-section').querySelector('ul').children;
        // Using a for loop so we can use await inside of it
        for (const node of volunteering) {
          const titleElement = node.querySelector('h3');
          const title = titleElement?.textContent || null;

          const srcElement = node.querySelector('img.pv-entity__logo-img');
          const src = srcElement?.getAttribute('src') || null;

          const companyElement = node.querySelector('.pv-entity__secondary-title');
          const companyElementClean = companyElement && companyElement?.querySelector('span') ? companyElement?.removeChild(companyElement.querySelector('span') as Node) && companyElement : companyElement || null;
          const company = companyElementClean?.textContent || null;

          const descriptionElement = node.querySelector('.pv-entity__description');
          const description = descriptionElement?.textContent || null;

          const dateRangeElement = node.querySelector('.pv-entity__date-range span:nth-child(2)');
          const dateRangeText = dateRangeElement?.textContent || null;

          const startPart = dateRangeText?.split('–')[0] || null;
          const start = startPart?.trim() || null;

          const endPart = dateRangeText?.split('–')[1] || null;
          const current = endPart?.trim().toLowerCase() === 'present' || false;
          const end = (endPart && !current) ? endPart.trim() : 'Present';

          profile['experiences'].push({
            title: cleanText(title),
            src: src.includes('http') ? src : null,
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

        writeDataTs('home', {...profile, ...defaultData});

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
      await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=24&playlistId=${accounts.youtube.playlist}&key=${accounts.youtube.apikey}`)
        .then(res => res.json())
        .then(playlist => {
          if (Array.isArray(playlist.items)) {
            const videos = playlist.items
              .map((video) => ({
                title: video.snippet.title,
                description: cleanText(video.snippet.description),
                url: `https://youtu.be/${video.contentDetails.videoId}`,
                src: (Object.values(video.snippet.thumbnails) as any[]).sort((a, b) => a.width - b.width).pop().url,
                date: video.contentDetails.videoPublishedAt,
              }));

            writeDataTs('youtube', videos);
            console.log('Saved YouTube videos.');
          }
        })
        .catch(() => console.log('Could not save YouTube videos.'));
    }
  } else {
    writeDataTs('youtube', []);
  }

  process.exit(0);
})();
