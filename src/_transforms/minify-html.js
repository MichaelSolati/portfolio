const minify = require('html-minifier').minify;

/**
 * @param {string} content
 * @param {string} outputPath
 * @returns {string}
 */
const minifyHtml = (content, outputPath) => {
  if (outputPath && outputPath.endsWith('.html')) {
    try {
      content = minify(content, {
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        sortClassName: true,
        sortAttributes: true,
        html5: true,
        decodeEntities: true,
      });
      return content;
    } catch (err) {
      console.warn('Could not minify html for', outputPath);
    }
  }

  return content;
};

module.exports = {minifyHtml};
