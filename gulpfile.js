"use strict";

var gulp = require('gulp')
var lint = require('eslint');
var browserify = require('browserify');
var reactify = require('reactify');
var transform = require('vinyl-transform');
var uglify = require('uglify-js');

var path = {
    ENTRY_POINT:'./src/*.js',
    DEST: './dist'
};

// gulp.task('lint', function () {
//     return js.pipe(lint())
//         .pipe(lint.format());
// });

gulp.task('scripts', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    // pre-bundle actions here
    b.transform(reactify)
    return b.bundle();
  });
  return gulp.src(path.ENTRY_POINT)
    .pipe(browserified)
    // post-bundle actions here
   // .pipe(uglify())
    .pipe(gulp.dest(path.DEST));
});

gulp.task('html', function(){
    return gulp.src('./src/index.html')
            .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['html', 'scripts'], function () {
});
