const criticalCss = require('eleventy-critical-css');
const {cache} = require('eleventy-plugin-workbox');

// Filters
const {trim} = require('./src/_filters/trim');

// Transforms
const {minifyHtml} = require('./src/_transforms/minify-html');

const isProd = process.env.NODE_ENV === 'prod';

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addPassthroughCopy({'src/assets': 'assets'});

  // Filters
  eleventyConfig.addFilter('pathJoin', e => {
    console.log(e);
    console.log(require('path').join(e));
    return require('path').join(e);
  });
  eleventyConfig.addFilter('trim', trim);

  // Plugins
  if (isProd) {
    eleventyConfig.addPlugin(cache, {enabled: isProd});
    eleventyConfig.addPlugin(criticalCss, {
      assetPaths: ['./theme.css', './style.css'],
      height: 1080,
      width: 1920,
    });
  }

  // Transforms
  if (isProd) {
    eleventyConfig.addTransform('minifyHtml', minifyHtml);
  }

  return {
    templateFormats: ['njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src/site/',
      includes: '../_includes',
      data: '../_data',
      output: 'dist/',
    },
  };
};
