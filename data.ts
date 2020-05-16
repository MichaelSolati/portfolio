require('dotenv').config();
import * as prompts from 'prompts';
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
const scrollToBottom = require('scroll-to-bottomjs');
const JSDOM = require('jsdom').JSDOM;

import { environment } from './src/environments/environment.prod';

const skipPrompts = (process.argv).find((a) => ['--skipPrompts', '-S'].includes(a));
const accounts = {
  devto: environment.devto || process.env.DEVTO,
  github: environment.github || process.env.GITHUB,
  linkedin: {
    profile: environment.linkedin || process.env.LINKEDIN_ACCOUNT,
    email: (environment.linkedin || process.env.LINKEDIN_ACCOUNT) && (environment.email || process.env.LINKEDIN_EMAIL),
    password: process.env.LINKEDIN_PASSWORD,
  },
  youtube: {
    playlist: environment.youtube || process.env.YOUTUBE,
    apikey: environment.firebase.apiKey || process.env.YOUTUBE_APIKEY,
  }
};
const appFolder = path.join('src', 'app');

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const cleanText = (text: string = '') => {
  const regexRemoveMultipleSpaces = / +/g
  const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm

  return (text || '')
    .replace(regexRemoveLineBreaks, '')
    .replace(regexRemoveMultipleSpaces, ' ')
    .replace('...', '')
    .replace('See more', '')
    .replace('See less', '')
    .trim();
}

(async () => {
  // dev.to
  if (accounts.devto) {
    console.log('Fetching dev.to posts');
    await fetch(`https://dev.to/api/articles?username=${accounts.devto}`)
      .then(res => res.json())
      .then(posts => {
        posts = posts
        .filter(() => posts.type_of !== 'article')
        .sort((a, b) => (new Date(b.published_at).getTime() - new Date(a.published_at).getTime()))
        .slice(0, 12)
        .map((post) => ({
          title: post.title,
          description: post.description,
          url: post.url,
          src: post.social_image,
          date: post.published_at,
        }));

        writeFileSync(
          path.join(appFolder, 'articles', 'data.json'),
          JSON.stringify(posts)
        );
      });
    console.log('Saved dev.to posts');
  }

  // GitHub
  if (accounts.github) {
    console.log('Fetching GitHub repos.');
    await fetch(`https://api.github.com/users/${accounts.github}/repos`)
      .then(res => res.json())
      .then(repos => {
        if (Array.isArray(repos)) {
          repos = repos
            .sort((a, b) => (
              b.stargazers_count - a.stargazers_count ||
              (new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            ))
            .slice(0, 12)
            .map((repo) => ({
              title: repo.name,
              description: repo.description,
              url: repo.html_url,
              date: repo.updated_at,
            }));

          writeFileSync(
            path.join(appFolder, 'code', 'data.json'),
            JSON.stringify(repos)
          );
        }
      });
    console.log('Saved GitHub repos.');
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
        await sleep(5000);
        await page.goto(profileUrl, { waitUntil: 'networkidle2' });
        await page.evaluate(scrollToBottom);
        await sleep(5000);
        await page.$('a.lt-line-clamp__more').then((e) => e.click());
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

        // START EXPERIENCE
        const experience = document.querySelector('#experience-section').querySelector('ul').children;
        profile['experience'] = [];
        // Using a for loop so we can use await inside of it
        for (const node of experience) {
          const titleElement = node.querySelector('h3');
          const title = titleElement?.textContent || null;

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

          const locationElement = node.querySelector('.pv-entity__location span:nth-child(2)');
          const location = locationElement?.textContent || null;

          profile['experience'].push({
            title: cleanText(title),
            company: cleanText(company),
            location: cleanText(location),
            start: new Date(cleanText(start)),
            end: new Date(cleanText(end)),
            current,
            description: cleanText(description),
          });
        }
        // END EXPERIENCE

        // START EDUCATION
        const education = document.querySelector('#education-section').querySelector('ul').children;
        profile['education'] = [];

        for (const node of education) {

          const schoolElement = node.querySelector('h3.pv-entity__school-name');
          const school = schoolElement?.textContent || null;

          const degreeElement = node.querySelector('.pv-entity__degree-name .pv-entity__comma-item');
          const degree = degreeElement?.textContent || null;

          const fieldElement = node.querySelector('.pv-entity__fos .pv-entity__comma-item');
          const field = fieldElement?.textContent || null;

          const dateRangeElement = node.querySelectorAll('.pv-entity__dates time');

          const startPart = dateRangeElement && dateRangeElement[0]?.textContent || null;
          const start = startPart || null

          const endPart = dateRangeElement && dateRangeElement[1]?.textContent || null;
          const end = endPart || null

          profile['education'].push({
            school: cleanText(school),
            degree: cleanText(degree),
            field: cleanText(field),
            start: new Date(cleanText(start)),
            end: new Date(cleanText(end)),
          })
        }
        // END EDUCATION

        for (let key in profile) {
          if (typeof profile[key] === 'string') {
            profile[key] = cleanText(profile[key]);
          }
        }

        writeFileSync(
          path.join(appFolder, 'home', 'data.json'),
          JSON.stringify(profile)
        );

        console.log('Saved LinkedIn profile.');
      } catch (e) {
        console.log(e)
        console.log('Could not save LinkedIn profile.');
      }
    }
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
      await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=12&playlistId=${accounts.youtube.playlist}&key=${accounts.youtube.apikey}`)
        .then(res => res.json())
        .then(playlist => {
          if (Array.isArray(playlist.items)) {
            const videos = playlist.items
              .map((video) => ({
                title: video.snippet.title,
                description: cleanText(video.snippet.description),
                url: `https://youtu.be/${video.contentDetails.videoId}`,
                src: (Object.values(video.snippet.thumbnails) as any[]).sort((a, b) => b.width - a.width).pop().url,
                date: video.contentDetails.videoPublishedAt,
              }));

            writeFileSync(
              path.join(appFolder, 'talks', 'data.json'),
              JSON.stringify(videos)
            );
          }
        });
      console.log('Saved YouTube videos.');
    }
  }

  process.exit(0)
})();
