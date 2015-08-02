
// -----------v 02.08.2015---------------------------------------------
// run npm install   /  npm update —save-dev
// run gulp bower    /  bower-update
// run gulp
// --------------------------------------------------------------------


// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp        = require("gulp"),
    bower       = require('gulp-bower'),
    data        = require('gulp-data'),
    browserSync = require('browser-sync'),
    jade        = require("gulp-jade"),
    minifyHTML  = require('gulp-minify-html'),
    sass        = require("gulp-sass"),
    autoprefix  = require("gulp-autoprefixer"),
    minify_css  = require("gulp-minify-css"),
    concat      = require("gulp-concat"),
    rename      = require('gulp-rename'),
    uglify      = require("gulp-uglify"),
    jshint      = require("gulp-jshint"),
    sourcemaps  = require("gulp-sourcemaps"),
    notify      = require("gulp-notify"),
    cache       = require('gulp-cache'),
    size        = require('gulp-size'),
    imagemin    = require("gulp-imagemin"),
    pngquant    = require("imagemin-pngquant");


// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------

var paths = {
    'bower' : './assets/bower',
    'assets': './assets',
    'outputDev': './dev',
    'outputDist': './dist'
};


// --------------------------------------------------------------------
// Task: Bower Components
// --------------------------------------------------------------------

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(paths.bower + '/')) ;
});


// --------------------------------------------------------------------
// Task: Jade Templating
// --------------------------------------------------------------------

gulp.task('templates', function() {
    return gulp.src(paths.assets + '/templates/**/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(paths.outputDev + '/'))
        .pipe(browserSync.reload({stream:true}));
});


// --------------------------------------------------------------------
// Task: Html build
// --------------------------------------------------------------------

gulp.task('html', ['templates'], function() {
  var opts = {
    empty: true,
    loose: true
  };

  return gulp.src(paths.outputDev + '/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(paths.outputDist + '/'));
});


// --------------------------------------------------------------------
// Task: Sass
// --------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp.src(paths.assets + '/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      onError: browserSync.notify
    }))
    .pipe(autoprefix('last 2 version'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.outputDev + '/css'))
    .pipe(minify_css())
    .pipe(gulp.dest(paths.outputDist + '/css'))
    .pipe(size({gzip: true}))
    .pipe(browserSync.reload({stream:true}));
});


// --------------------------------------------------------------------
// Task: Scripts
// --------------------------------------------------------------------

gulp.task('scripts', function() {
  return gulp.src(paths.assets + '/scripts/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.outputDev + '/js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.outputDist + '/js'))
    .pipe(browserSync.reload({stream:true}));
});


// --------------------------------------------------------------------
// Task: Compress Images
// --------------------------------------------------------------------

gulp.task('images', function() {
  return gulp.src(paths.assets + '/images/**/*.{gif,jpg,png}')
    .pipe(cache(imagemin({ optimizationLevel: 4, progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.outputDev + '/images'))
    .pipe(gulp.dest(paths.outputDist + '/images'));
});


// --------------------------------------------------------------------
// Task: Watch
// --------------------------------------------------------------------

gulp.task('watch', ['sass', 'browserSync'], function() {
  // Watch jade files
  gulp.watch(paths.assets + '/templates/**/*.jade', ['templates']);
  // Watch html files
  gulp.watch(paths.outputDev + '/*.html', ['html'], browserSync.reload);
  // Watch .scss files
  gulp.watch(paths.assets + '/scss/**/*.scss', ['sass']);
  // Watch .js files
  gulp.watch(paths.assets + '/scripts/**/*.js', ['scripts']);
  // Watch image files
  gulp.watch(paths.assets + '/images/**/*', ['images']);
});


// --------------------------------------------------------------------
// Task: Browser-Sync
// --------------------------------------------------------------------

gulp.task('browserSync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: 'dev'
        }
    });
});


// --------------------------------------------------------------------
// Task: Default
// --------------------------------------------------------------------

gulp.task('default', ['sass', 'scripts', 'images', 'html', 'browserSync', 'watch']);
