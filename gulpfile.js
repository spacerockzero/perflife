'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// images bits
// var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');
// var browserSync = require('browser-sync');

// css bits
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

// browserify bits:
var browserify = require('browserify');

// var reload = browserSync.reload;

gulp.task('images', function(){
  return gulp.src('assets/img/*')
    // imagemin is broken somehow
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


function createBundler(src) {
  var b;

  if (plugins.util.env.production) {
    b = browserify();
  }
  else {
    b = browserify({
      cache: {}, packageCache: {}, fullPaths: true,
      debug: true
    });
  }

  b.transform(hbsfy);

  if (plugins.util.env.production) {
    b.transform({
      global: true
    }, 'uglifyify');
  }

  b.add(src);
  return b;
}

var bundlers = {
  'js/page.js': createBundler('./src/js/page/index.js'),
  'sw.js': createBundler('./src/js/sw/index.js')
};

function bundle(bundler, outputPath) {
  var splitPath = outputPath.split('/');
  var outputFile = splitPath[splitPath.length - 1];
  var outputDir = splitPath.slice(0, -1).join('/');

  return bundler.bundle()
    // log errors if they happen
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source(outputFile))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({ loadMaps: true })) // loads map from browserify file
    .pipe(plugins.sourcemaps.write('./')) // writes .map file
    .pipe(plugins.size({ gzip: true, title: outputFile }))
    .pipe(gulp.dest('dist/' + outputDir))
    .pipe(reload({ stream: true }));
}


gulp.task('watch', function(){
  livereload.listen();
  watch('assets/css/**/*', function(){ gulp.start('css'); });
  watch('assets/img/**/*', function(){ gulp.start('images'); });
});

gulp.task('default', ['images', 'css', 'watch']);
