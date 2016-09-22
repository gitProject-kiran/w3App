var gulp = require('gulp'),
    browserify = require('browserify'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    stringify = require('stringify'),
    browserSync = require('browser-sync').create(),
    jshint = require('gulp-jshint');

gulp.task('copy', function () {
    gulp.src(['./public/*.html', './public/**/*.css', './public/**/*.png'])
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('scss', function() {
    gulp.src('./public/assets/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/assets/'));
});

gulp.task('lint', function () {
    return gulp.src('./public/services/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', ['lint','scss', 'copy'], function () {
    return browserify('public/app.js')
        .transform(stringify, {
            appliesTo: {includeExtensions: ['.html']},
            minify: true
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('browser-sync', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: "./build",
            routes: {
                "/node_modules": "node_modules"
            }
        },
        browser: "chrome"
    });
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch("./public/**/*.*", ["build"]);
    gulp.watch("./build/**/*.*").on('change', browserSync.reload);
});

