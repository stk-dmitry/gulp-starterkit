/* eslint-disable */
const assets = require('postcss-assets');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const reporter = require('postcss-browser-reporter');
const nested = require('postcss-nested');
const short = require('postcss-short');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const precss = require('precss');

gulp.task('default', ['build']);
gulp.task('dev', ['build', 'browserSync', 'watch']);
gulp.task('build', ['styles', 'handelbars', 'fonts', 'assets', 'scripts']);

gulp.task('handelbars', () => {
  const options = {
    batch: ['./src/templates'],
  };

  gulp.src('src/*.hbs')
    .pipe(handlebars(require('./config.json'), options))
    .pipe(rename(path => { path.extname = '.html' }))
    .pipe(gulp.dest('public'));
});

gulp.task('styles', () => {
  const processors = [
    nested,
    assets,
    precss,
    short,
    autoprefixer,
    reporter({ selector: 'body:before' }),
  ];

  return gulp.src('./src/styles/**/*.css')
    .pipe(postcss(processors))
    .pipe(concat('bundle.min.css'))
    .pipe(gulp.dest('./public/styles/'));
});

gulp.task('assets', () => {
  gulp.src('./src/assets/**/*.{png,jpg,svg,ico,webp,mp4}')
    .pipe(gulp.dest('./public/assets/'));
});

gulp.task('fonts', () => {
  gulp.src('./src/assets/fonts/**/*.**')
    .pipe(gulp.dest('./public/assets/fonts/'));
});

gulp.task('scripts', () => {
  gulp.src('./src/scripts/**/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: { baseDir: './public' },
  });
});

gulp.task('watch', () => {
  gulp.watch('./src/styles/**/*.css', ['styles']);
  gulp.watch('./src/scripts/**/*.js', ['scripts']);
  gulp.watch('{./src/**/*.hbs,./**/*.json}', ['handelbars']);
  gulp.watch('./public/**/*').on('change', browserSync.reload);
});
