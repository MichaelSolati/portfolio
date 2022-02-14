const gulp = require('gulp');
const sass = require('./gulp/sass');

gulp.task('sass', sass);

gulp.task('watch:sass', () => {
  gulp.watch('./src/scss/**/*.{scss,sass}', {ignoreInitial: false}, sass);
});
