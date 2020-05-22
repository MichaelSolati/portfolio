const { SitemapStream, streamToPromise } = require('sitemap');
import * as fs from 'fs';
import * as path from 'path';

export const generateSitemap = async (environment) => {
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
  fs.writeFileSync(path.join('src', 'sitemap.xml'), sitemap);
}
