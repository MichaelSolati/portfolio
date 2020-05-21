import * as puppeteer from 'puppeteer';

import { environment } from './src/environments/environment.general';

const crawlable: any[] = Object.keys(environment.pages)
  .filter((key) => environment.pages[key].enabled || key === 'home')
  .map((key) => ({
    path: environment.pages[key].path,
    imagePath: `./src/assets/screenshots/${key}.png`
  }));

(async () => {
  console.log('Launching Puppeteer to take screenshots');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

  for (let route of crawlable) {
    console.log(`Taking screenshot of "/${route.path}"`);
    try {
      await page.goto('http://localhost:5000/' + route.path, { waitUntil: 'networkidle2', timeout: 10000 });
    } catch {}
    await page.screenshot({ path: route.imagePath });
  }

  console.log(`Took ${crawlable.length} screenshots!`);
  await browser.close();
  process.exit(0);
})();
