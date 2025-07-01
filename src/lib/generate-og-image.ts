import fs from 'fs';
import * as LucideIcons from 'lucide-static';
import path from 'path';
import satori from 'satori';
import sharp from 'sharp';

import {siteConfig} from '@/config/site';

import OGImageTemplate from './og-image-template';

async function getFontData(assetPath: string): Promise<Buffer> {
  const fontPath = path.join(process.cwd(), assetPath);
  return fs.promises.readFile(fontPath);
}

function getIcon(pathname: string): string {
  const navItem = siteConfig.nav[pathname as keyof typeof siteConfig.nav];
  if (navItem?.icon) {
    return LucideIcons[navItem.icon as keyof typeof LucideIcons];
  }
  return LucideIcons.Home;
}

export async function generateOGImage({
  title,
  pathname,
}: {
  title: string;
  pathname: string;
}) {
  const cacheDir = path.join(process.cwd(), 'public/og-cache');
  const slug = (pathname.replace(/\//g, '') || 'home').replace(
    /[^a-zA-Z0-9_-]/g,
    '-',
  );
  const fileName = `${slug}.png`;
  const filePath = path.join(cacheDir, fileName);
  const icon = getIcon(pathname);

  if (fs.existsSync(filePath)) {
    return `/og-cache/${fileName}`;
  }

  const spaceGroteskBold = await getFontData(
    'public/fonts/SpaceGrotesk-Bold.otf',
  );

  const svg = await satori(OGImageTemplate({icon, title}), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Space Grotesk',
        data: spaceGroteskBold,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  fs.mkdirSync(cacheDir, {recursive: true});
  await fs.promises.writeFile(filePath, pngBuffer);

  return `/og-cache/${fileName}`;
}
