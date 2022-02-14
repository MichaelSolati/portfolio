const {AssetCache} = require('@11ty/eleventy-cache-assets');
const getSrcset = require('@renditions/get-srcset').default;
const fs = require('fs');
const https = require('https');
const md5 = require('md5');
const {tmpdir} = require('os');
const path = require('path');
const sharp = require('sharp');
const webpConverter = require('webp-converter');

const quality = 30;
const srcsetWidths = [240, 360, 480, 720, 1080];
const tempDirectory = tmpdir();

// Create width folders if they don't exist
for (const width of srcsetWidths) {
  const directory = path.join(
    __dirname,
    '../',
    'src',
    'assets',
    'images',
    String(width)
  );
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

/**
 * Takes image base name and returns absolute path of image.
 *
 * @param {string} img Image basename.
 * @returns {string}
 */
const createOutputPath = img =>
  path.join(__dirname, '../', 'src', createOutputSrc(img));

/**
 * Takes image base name and returns web path of image.
 *
 * @param {string} img Image basename.
 * @returns {string}
 */
const createOutputSrc = img => path.join('/assets', 'images', img);

/**
 * Takes a WebP basename and creates srcset files and returns srcset string.
 *
 * @param {string} webp WebP basename.
 * @returns {Promise<string>}
 */
const createSrcSet = async webp => {
  const srcsetData = srcsetWidths.map(width => ({
    src: path.join('/assets', 'images', String(width), webp),
    width,
  }));
  const srcset = getSrcset(srcsetData, true);
  // Create srcset
  for (const size of srcsetData) {
    const sizePath = path.join(__dirname, '../', 'src', size.src);
    await sharp(createOutputPath(webp))
      .webp({quality})
      .resize(size.width)
      .toFile(sizePath);
  }

  return srcset;
};

/**
 * Takes a local file and converts it to WebP.
 *
 * @param {string} downloadedImage Absolute path to image.
 * @param {string} webp WebP filename.
 */
const createWebp = async (downloadedImage, webp) => {
  const outputPath = createOutputPath(webp);
  const isGif = path.extname(downloadedImage).toLowerCase() === '.gif';
  const webpFunction = isGif ? webpConverter.gwebp : webpConverter.cwebp;
  await webpFunction(downloadedImage, outputPath, `-q ${quality}`);
};

/**
 * Downloads an image and saves it into temp storage.
 *
 * @param {string} url
 * @param {string} filename
 * @returns {Promise<string|void>}
 */
const downloadImage = (url, filename) => {
  const dest = path.join(tempDirectory, filename);
  return new Promise(resolve => {
    https
      .get(url, res => {
        if (res.statusCode !== 200) {
          return resolve();
        }

        res.pipe(fs.createWriteStream(dest)).once('close', () => resolve(dest));
      })
      .on('timeout', () => resolve())
      .on('error', () => resolve());
  });
};

/**
 * @param {string} url
 * @param {string} prefix
 * @returns {Promise<{src: string, srcset?: string}>}
 */
module.exports = async (url, prefix) => {
  const srcs = {};
  const img = `${prefix}-${md5(url)}${path.extname(url)}`;
  const webp = `${path.basename(img, path.extname(img))}.webp`;
  const assetName = md5(webp);

  // Check if asset exists
  const asset = new AssetCache(assetName);
  if (asset.isCacheValid('6h')) {
    return await asset.getCachedValue();
  }

  const downloadedImage = await downloadImage(url, img);

  if (!downloadedImage) {
    srcs.src = url;
    await asset.save(srcs, 'json');
    return srcs;
  }

  // Create base webp file
  await createWebp(downloadedImage, webp);

  srcs.src = createOutputSrc(webp);
  srcs.srcset = await createSrcSet(webp);

  await asset.save(srcs, 'json');
  return srcs;
};

module.exports.createOutputPath = createOutputPath;
module.exports.createOutputSrc = createOutputSrc;
module.exports.createSrcSet = createSrcSet;
module.exports.createWebp = createWebp;
module.exports.downloadImage = downloadImage;
