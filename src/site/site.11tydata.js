const path = require('path');
const aboutData = require('../_data/about.json');
const pagesData = require('../_data/pages.json');
const pagesKeys = Object.keys(pagesData);

module.exports = {
  eleventyComputed: {
    background: data => {
      const fileSlug = data.page.fileSlug;
      if (pagesKeys.includes(fileSlug) && aboutData[fileSlug]) {
        return pagesData[fileSlug].background;
      } else if (pagesKeys.includes(fileSlug)) {
        return '';
      } else {
        return data.backgroun;
      }
    },
    description: data => {
      const fileSlug = data.page.fileSlug;
      if (pagesKeys.includes(fileSlug) && aboutData[fileSlug]) {
        return pagesData[fileSlug].description;
      } else if (pagesKeys.includes(fileSlug)) {
        return '';
      } else {
        return data.description;
      }
    },
    permalink: data => {
      const fileSlug = data.page.fileSlug;
      if (pagesKeys.includes(fileSlug) && aboutData[fileSlug]) {
        return path.join(pagesData[fileSlug].path, 'index.html');
      } else if (pagesKeys.includes(fileSlug)) {
        return false;
      } else {
        return data.permalink;
      }
    },
    title: data => {
      const fileSlug = data.page.fileSlug;
      if (pagesKeys.includes(fileSlug) && aboutData[fileSlug]) {
        return pagesData[fileSlug].title;
      } else if (pagesKeys.includes(fileSlug)) {
        return '';
      } else {
        return data.title;
      }
    },
  },
};
