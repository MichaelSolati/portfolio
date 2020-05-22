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
      fs.writeFileSync(filePath, JSON.stringify(manifest, null, '\t'));
    });
    console.log('Updated `manifest.webmanifest`s');
  }
}
