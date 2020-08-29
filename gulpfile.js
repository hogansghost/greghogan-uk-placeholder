'use strict';

const gulp = require('gulp');

const clean           = require('gulp-clean');
const sourcemaps      = require('gulp-sourcemaps');
const sass            = require('gulp-sass');
const sassInheritance = require('gulp-sass-inheritance');
const autoprefixer    = require('gulp-autoprefixer');
const minify          = require('gulp-minify');
const imagemin        = require('gulp-imagemin');
const liveserver      = require('gulp-live-server');



/**
 * References
 */

// Folders.
const bases = {
  src: './src/',
  dist: './dist/'
};



/**
 * Tasks
 */

// Clear the current dist folder.
gulp.task('clean', function() {
  return gulp.src(bases.dist)
    .pipe(clean());
});



// Minimise images and clone them to dist.
gulp.task('imagemin', [], function() {
  return gulp.src(['assets/images/**/*.*'], {
    cwd: bases.src
  })
  .pipe(imagemin())
  .pipe(gulp.dest(bases.dist + 'assets/images/'));
});

// Copy src HTML files to dist.
gulp.task('compile-html', [], function() {
  console.log('Cloning files, HTML, manifest.json, etc.');

  gulp.src(['*'], {
    cwd: bases.src
  })
  .pipe(gulp.dest(bases.dist));
});

// Copy src favicon files to dist.
gulp.task('compile-favicon', [], function() {
  gulp.src(['favicon.png'], {
    cwd: bases.src
  })
  .pipe(gulp.dest(bases.dist));
});

// Copy src fonts files to dist.
gulp.task('compile-fonts', [], function() {
  gulp.src(['**/*'], {
    cwd: bases.src + 'assets/'
  })
  .pipe(gulp.dest(bases.dist + 'assets/'));
});

// Compile Sass.
gulp.task('compile-sass', [], function() {
  return gulp.src(bases.src + 'styles/**/*')
    .pipe(sourcemaps.write())
    .pipe(sassInheritance({
      dir: bases.src + 'styles/'
    }))
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(bases.dist + 'styles/'));
});

// Compile JS.
gulp.task('compile-js', [], function() {
  return  gulp.src(['**/*'], {
    cwd: bases.src + 'scripts/'
  })
  .pipe(minify())
  .pipe(gulp.dest(bases.dist + 'scripts'));
});



/**
 * Build and serve tasks.
 */

gulp.task('default', gulp.series('clean', 'compile-favicon', 'compile-fonts', 'imagemin', 'compile-sass', 'compile-js', 'compile-html']);

gulp.task('watch', ['compile-favicon', 'compile-fonts', 'imagemin', 'compile-sass', 'compile-js', 'compile-html'], function() {
  gulp.watch(bases.src + 'styles/**/*.scss', ['compile-sass']);
  gulp.watch(bases.src + 'scripts/**/*.js', ['compile-js']);
  gulp.watch(bases.src + '*', ['compile-html']);
});

gulp.task('serve', gulp.series('watch', function() {
  const server = liveserver.static(bases.dist, 4211);

  server.start();

  gulp.watch([bases.src + '/**/*'], function (file) {
    console.log('Reloading...');

    server.notify.apply(server, [file]);

    // doesnt work - comes from doc
    // server.notify.apply(server, [file]);

    // works
    // server.start.bind(server)();
  });
}));