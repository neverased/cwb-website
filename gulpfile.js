var GLOBAL = {
    dirs: {
        sass: './src/sass/',
        pug: './src/pug/',
        assets: './assets/',
        css: './assets/css/',
    },
    themeName: 'oona'
};

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function buildSass() {
    return gulp.src(GLOBAL.dirs.sass + '*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(GLOBAL.dirs.css));
}

exports.buildSass = buildSass;
exports.watch = function() {
    gulp.watch(GLOBAL.dirs.sass + '*.scss', buildSass);
}

exports.default = gulp.series(buildSass);