/* eslint-disable */

const gulp = require('gulp');
const gulpless = require('gulp-less');
const postcss = require('gulp-postcss');
const debug = require('gulp-debug');
let csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');
const NpmImportPlugin = require('less-plugin-npm-import');

gulp.task('theme', function () {
  const plugins = [autoprefixer()]

  return gulp
    .src('assets/less/*.less')
    .pipe(debug({title: 'Less files:'}))
    .pipe(
      gulpless({
        javascriptEnabled: true,
        plugins: [new NpmImportPlugin({prefix: '~'})],
      }),
    )
    .pipe(postcss(plugins))
    .pipe(
      csso({
        debug: true,
      }),
    )
    .pipe(gulp.dest('./public/css'))
})

gulp.task('watch', function () {
  return gulp.watch('assets/less/**/*.less', gulp.series('theme'));
});