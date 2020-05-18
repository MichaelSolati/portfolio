import * as puppeteer from 'puppeteer';

import { routes } from './src/app/app-routing.module';

const crawlable = routes
  .filter((r) => !r.redirectTo)
  .map((r) => ({
    path: r.path,
    imagePath: `./src/assets/screenshots/${(r.path === '') ? 'home' : r.path}.png`
  }));

(async () => {
  console.log('Launching Puppeteer to take screenshots');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 500 });

  for (let route of crawlable) {
    console.log(`Taking screenshot of "/${route.path}"`);
    await page.goto('http://localhost:5000/' + route.path, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: route.imagePath });
  }

  console.log(`Took ${crawlable.length} screenshots!`);
  await browser.close();
  process.exit(0);
})();
