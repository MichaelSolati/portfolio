import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
const JSDOM = require('jsdom').JSDOM;
const pngToIco = require('png-to-ico');
const rimraf = require('rimraf');
const sharp = require('sharp');

import { saveImagetoWebP, writeDataTs } from './utils'

export const generateDevTo = async (accounts, defaultData) => {
  if (accounts.devto) {
    console.log('Fetching dev.to posts');
    const res = await fetch(`https://dev.to/api/articles?username=${accounts.devto}`);
    try {
      let posts = await res.json();
      const devtoAssetsPath = path.join('src', 'assets', 'devto');
      rimraf.sync(devtoAssetsPath);
      fs.mkdirSync(devtoAssetsPath);

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
        const tempProfilePath = (await saveImagetoWebP(src, path.join('src', 'assets', 'profile.webp'))).output;
        defaultData['image'] = './assets/profile.webp';
        console.log('Saved dev.to profile picture.');

        const iconsPath = path.join('src', 'assets', 'icons');
        const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];
        pwaSizes.forEach(async (px) => {
          await sharp(tempProfilePath).resize({ height: px, width: px }).toFile(path.join(iconsPath, `icon-${px}x${px}.png`));
        });

        const png = fs.readFileSync(path.join(iconsPath, 'icon-72x72.png'));
        await pngToIco(png).then(buf => {
          fs.writeFileSync(path.join('src', 'favicon.ico'), buf);
        });
      })
      .catch(() => {
        console.log('Could not save dev.to profile picture.')
      });
  } else {
    writeDataTs('devto', []);
  }
}
