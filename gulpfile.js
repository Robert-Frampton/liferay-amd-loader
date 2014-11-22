'use strict';

var concat = require('gulp-concat');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('clean', function (callback) {
    del(['dist'], callback);
});

gulp.task('config', function() {
    return gulp.src('src/config/**/*.*')
        .pipe(gulp.dest('dist/config'));
});

gulp.task('vendor-js', function() {
    return gulp.src([
        'src/vendor/eventemitter2.js',
        'src/vendor/promise.js',
        ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('combine-js', function() {
    return gulp.src([
        'src/js/utils.js',
        'src/js/config-parser.js',
        'src/js/dependency-builder.js',
        'src/js/url-builder.js',
        'src/js/script-loader.js',
        ])
    .pipe(concat('source.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('js', ['combine-js', 'vendor-js'], function() {
    return gulp.src('src/template/loader.template')
        .pipe(template({
            vendor: fs.readFileSync('dist/js/vendor.js'),
            source: fs.readFileSync('dist/js/source.js')
        }))
        .pipe(rename('loader.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('loader-min', ['js'], function() {
    return gulp.src('dist/js/loader.js')
        .pipe(uglify())
        .pipe(rename('loader-min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('source-min', ['js'], function() {
    return gulp.src('dist/js/source.js')
        .pipe(uglify())
        .pipe(rename('source-min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('modules', function() {
    return gulp.src('src/modules/**/*.*')
        .pipe(gulp.dest('dist/modules'));
});

gulp.task('vendor', function() {
    return gulp.src('src/vendor/**/*.*')
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('demo', function() {
    return gulp.src('src/demo/**/*.*')
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function(callback) {
    runSequence('clean', ['config', 'loader-min', 'source-min', 'modules', 'vendor', 'demo'], callback);
});

gulp.task('default', function(callback) {
    runSequence('build', callback);
});

gulp.task('watch', ['build'], function () {
    watch('src/**/*.*', function (files, cb) {
        gulp.start('build', cb);
    });
});