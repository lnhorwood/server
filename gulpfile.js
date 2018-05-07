const gulp = require('gulp');
const install = require('gulp-install');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');

gulp.task('default', () => {
    return gulp.src(['./package.json'])
        .pipe(gulp.dest(BUILD_DIR))
        .pipe(install({
            npm: ['--production']
        }));
});