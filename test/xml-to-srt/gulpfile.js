var gulp = require('gulp'),
    gulpTranslationToolSrt = require('../../');

var PATH_SRC = './',
    PATH_DEST = './';

gulp.task('default', function(done){
    return gulp.src(PATH_SRC + 'test.xml')
        .pipe(gulpTranslationToolSrt({
            mode: 'toSRT',
            name: 'myNewSrt'
        }))
        .pipe(gulp.dest(PATH_DEST));
});