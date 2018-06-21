var pjson = require('./package.json');
var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

var browserSync = require('browser-sync').create();

var paths = {
    scripts: {
        src: pjson.config.gulp.scripts.src,
        dest: pjson.config.gulp.scripts.dest
    },
    styles: {
        src: pjson.config.gulp.styles.src,
        dest: pjson.config.gulp.styles.dest
    }
};

function clean(){
    return del([ paths.scripts.dest ]);
    return del([ paths.styles.dest ]); // For style task
} 

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(babel({
            presets: [
			    ['es2015', { modules: false }] // disable the strict mode
			]
        }))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function watch() {

    if(pjson.config.project.server === true){
        browserSync.init({
            // dont use with XAMPP create your own server
            server: {
                baseDir: "./",
                port: 3000,
                proxy: "http://localhost" + pjson.config.project.url
            }
        });
    } else {
        browserSync.init({
            // when use with XAMPP remove server: and add only  ex. proxy: "http://localhost/k2/ot"
            proxy: "http://localhost" + pjson.config.project.url
        });
    }

    gulp.watch(paths.scripts.src, gulp.parallel(scripts));
    //gulp.watch(paths.styles.src, gulp.parallel(styles)); // For style task
    gulp.watch("**/*.html").on('change', browserSync.reload);
    gulp.watch("**/*.php").on('change', browserSync.reload);
}

exports.clean = clean;
exports.scripts = scripts;
exports.watch = watch;

var build = gulp.series(clean, scripts, watch);
gulp.task('build', build);

gulp.task('default', build);