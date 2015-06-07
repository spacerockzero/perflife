'use strict';

var gulp = require('gulp');
// var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');
// var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

// var reload = browserSync.reload;

gulp.task('images', function(){
  return gulp.src('assets/img/*')
    // .pipe(imagemin({
    //     progressive: true,
    //     svgoPlugins: [{removeViewBox: false}],
    //     use: [pngquant()]
    // }))
    .pipe(gulp.dest('assets/_dist/img'));
});

gulp.task('css', function () {
  return gulp.src('assets/css/sass/*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/_dist/css'))
    .pipe(livereload());
});

gulp.task('watch', function(){
  livereload.listen();
  watch('assets/css/**/*', function(){ gulp.start('css'); });
  watch('assets/img/**/*', function(){ gulp.start('images'); });
});

gulp.task('default', ['images', 'css', 'watch']);
