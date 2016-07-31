"use strict";

var gulp = require('gulp')
var lint = require('gulp-eslint');
var browserify = require('gulp-browserify');
var reactify = require('reactify');

var js = gulp.src(['./src/*.js']);

gulp.task('lint', function () {
    return js.pipe(lint())
        .pipe(lint.format());
});

gulp.task('scripts', function () {
    return gulp.src(js)
        .pipe(browserify({
            globals: true
        }))
        .pipe(reactify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', function(){
    return gulp.src('./src/index.html')
            .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['lint', 'html', 'scripts'], function () {
});
