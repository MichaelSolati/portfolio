import * as fs from 'fs';
import * as path from 'path';

export const generateWebmanifest = async (environment) => {
  if (environment.site.name) {
    console.log('Updating `manifest.webmanifest`s');
      ['manifest.webmanifest', 'manifest.dark.webmanifest'].forEach((fileName) => {
        const filePath = path.join('src', fileName);
        const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        manifest.name = environment.site.name;
        manifest.short_name = environment.site.short_name;
        manifest.shortcuts = Object.keys(environment.pages)
          .filter((key) => environment.pages[key].enabled || key === 'home')
          .sort((a, b) => (environment.pages[b].name - environment.pages[a].name))
          .map((key) => ({
            url: (environment.pages[key].path === '') ? '/' : '/' + environment.pages[key].path,
            name: `View my ${key === 'home' ? 'Experiencs' : environment.pages[key].name}`,
            short_name: key === 'home' ? 'Experience' : environment.pages[key].name,
            icons: [{ src: `/assets/shortcuts/${fileName.includes('dark') ? 'dark' : 'light'}/${key}.png`, sizes: '192x192', type: 'image/png' }]
          }));
        fs.writeFileSync(filePath, JSON.stringify(manifest, null, '\t'));
      });
    console.log('Updated `manifest.webmanifest`s');
  }
}
