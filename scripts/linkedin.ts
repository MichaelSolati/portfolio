import * as path from 'path';
import * as prompts from 'prompts';
import * as puppeteer from 'puppeteer';
const JSDOM = require('jsdom').JSDOM;
const scrollToBottom = require('scroll-to-bottomjs');

import { cleanText, sleep, writeDataTs } from './utils'
import assetsStorage from './assets-storage';

export const generateLinkedIn = async (accounts, skipPrompts, defaultData) => {
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
        assetsStorage.deleteFolder('home');
        assetsStorage.createFolder('home');

        // START WORK EXPERIENCE
        const workExperiences: any[] = Array.from(document.querySelector('#experience-section').querySelector('ul').children).slice(0, 6);
        for (let i = 0; i < workExperiences.length; i++) {
          const experience = workExperiences[i];

          const titleElement = experience.querySelector('h3');
          const title = titleElement?.textContent || null;

          const srcElement = experience.querySelector('img.pv-entity__logo-img');
          const imgSrc = srcElement?.getAttribute('src') || null;
          let src: string;
          if (imgSrc.includes('http')) {
            const filename = `work-${i}`;
            try {
              src = (await assetsStorage.createImage(imgSrc, 'home', filename)).output;
            } catch {}
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
          const imgSrc = srcElement?.getAttribute('src') || null;
          let src: string;
          if (imgSrc.includes('http')) {
            const filename = `education-${i}`;
            try {
              src = (await assetsStorage.createImage(imgSrc, 'home', filename)).output;
            } catch {}
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
          const imgSrc = srcElement?.getAttribute('src') || null;
          let src: string;
          if (imgSrc.includes('http')) {
            const filename = `volunteer-${i}`;
            try {
              src = (await assetsStorage.createImage(imgSrc, 'home', filename)).output;
            } catch {}
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
}
