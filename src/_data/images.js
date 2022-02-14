const CacheAsset = require('@11ty/eleventy-cache-assets');
const {AssetCache} = require('@11ty/eleventy-cache-assets');
const JSDOM = require('jsdom').JSDOM;
const md5 = require('md5');
const path = require('path');
const sharp = require('sharp');

const about = require('./about.json');
const {
  createOutputPath,
  createOutputSrc,
  createSrcSet,
  createWebp,
  downloadImage,
} = require('../../tools/webp');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const prefix = 'profile';

/**
 * Takes WebP file in assets and creates Manifest Icons.
 *
 * @param {string} webp WebP basename.
 * @returns {Promise<{src: string, width: number}[]>}
 */
const createManifestIcons = async webp => {
  const iconData = iconSizes.map(width => ({
    src: `icon-${width}x${width}.webp`,
    width,
  }));

  for (const icon of iconData) {
    const iconPath = path.join(
      __dirname,
      '../',
      path.join('/assets', 'icons', icon.src)
    );
    await sharp(createOutputPath(webp)).resize(icon.width).toFile(iconPath);
  }

  return iconData;
};

module.exports = async () => {
  // Check if asset exists
  const asset = new AssetCache('images');
  if (asset.isCacheValid('6h')) {
    return await asset.getCachedValue();
  }

  /** @type {{src?: string, srcset?: string, ico?: string, icons?: {width: number, src: string}[]}} */
  const images = {};

  if (about.devto) {
    const html = await CacheAsset(`https://dev.to/${about.devto}`, {
      duration: '6h',
      type: 'text',
    }).catch(() => {
      throw new Error(`Error fetching profile of dev.to user: ${about.devto}`);
    });
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const image = /** @type {HTMLImageElement} */ (
      document.querySelector('img.crayons-avatar__image')
    );

    if (!image) return;

    const url = image.src.replace('h_320', 'h_1000').replace('w_320', 'w_1000');
    const webp = `${prefix}-${md5(url)}.webp`;

    const downloadedImage = await downloadImage(url, prefix);

    if (!downloadedImage) return;

    await createWebp(downloadedImage, webp);
    images.src = createOutputSrc(webp);
    images.srcset = await createSrcSet(webp);
    images.icons = await createManifestIcons(webp);

    await asset.save(images, 'json');
  }

  return images;
};
