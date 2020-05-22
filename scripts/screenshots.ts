import * as child_process from 'child_process';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

import { environment } from '../src/environments/environment.prod';

const distFolder = path.join(process.cwd(), 'dist', 'portfolio', 'browser');

const crawlable: any[] = Object.keys(environment.pages)
  .filter((key) => environment.pages[key].enabled || key === 'home')
  .map((key) => ({
    path: environment.pages[key].path,
    imagePath: `./src/screenshots/${key}.png`
  }));

const unusedPath = crawlable.reduce((accumulator, page) => (accumulator += page.path), '');

crawlable.push({
  path: unusedPath,
  imagePath: `./src/screenshots/404.png`
});

export const generateScreenshots = async () => {
  return new Promise((res, rej) => {
    console.log('Generating screenshots');
    console.log('Building Angular site');
    child_process.execSync('npm run build');
    console.log('Site built');
    const port = 3000;
    const app = express();
    app.get('*.*', express.static(distFolder));
    app.get(`*`, (req, res) => {
      const html = fs.readFileSync(path.join(distFolder, 'index.html'), { encoding: 'utf8' });
      return res.send(html);
    });
    console.log('Serving site');
    app.listen(port, async () => {
      console.log('Launching Puppeteer to take screenshots');
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630 });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

      for (let route of crawlable) {
        console.log(`Saving screenshot to "${route.imagePath}"`);
        try {
          await page.goto(`http://localhost:${port}/${route.path}`, { waitUntil: 'networkidle2', timeout: 10000 });
        } catch {}
        await page.screenshot({ path: route.imagePath });
      }

      console.log(`Took ${crawlable.length} screenshots!`);
      await browser.close();
      res();
    });
  });
};
