const {dest, src} = require('gulp');
const sassProcessor = require('gulp-sass')(require('sass'));

const sourceFiles = ['./src/scss/style.scss'];

const isProd = process.env.NODE_ENV === 'prod';

const sass = cb => {
  return src(sourceFiles, {sourcemaps: !isProd})
    .pipe(
      sassProcessor({
        outputStyle: isProd ? 'compressed' : 'expanded',
        includePaths: ['node_modules'],
      }).on('error', sassProcessor.logError)
    )
    .pipe(dest('./dist', {sourcemaps: !isProd}))
    .on('done', cb);
};

module.exports = sass;
