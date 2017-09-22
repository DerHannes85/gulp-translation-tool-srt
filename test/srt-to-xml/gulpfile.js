var gulp = require('gulp'),
    gutil = require('gulp-util');
    gulpTranslationToolSrt = require('../../');

var PATH_SRC = './data/',
    PATH_DEST = './data-done/';

gulp.task('default', function(done){
    return gulp.src(PATH_SRC + '*.srt')
        .pipe(gulpTranslationToolSrt({
            mode: 'toXML',
            name: function (basename) {
                return basename + '-done';
            }
        }))
        .pipe(gulp.dest(PATH_DEST));
});