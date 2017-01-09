'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var sass = require('gulp-sass');
var template = require('lodash.template');

var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jsonminify = require('gulp-jsonminify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var crx = require('gulp-crx-pack');
var jeditor = require("gulp-json-editor");


var crxAutoReload = require('crxautoreload');
var css2jsmap = require('gulp-css2jsmap');
var multifile = require('gulp-multifile');



/**
 * Configure
 * @type {Object}
 */
var config = {
    version: "0.4.10.2"
}

/**
 * Watch path
 * @type {Object}
 */
var paths = {
    tmpl: ["src/manifest.json", "src/template/*.tpl", "src/data/*.json", "src/**/*.js", "src/**/*.html",
        "!src/popup.html", "!src/content/colorstyle.js", "!src/reload.html"
    ]
};

gulp.task('gen:scss', function() {
    gulp.src('src/data/*.json')
        .pipe(multifile({
            template: "src/template/sass.tpl",
            rename: function(paths, data, dataFile) {
                paths.dirname = path.basename(dataFile.basename, '.json')
                paths.basename = data.name;
                paths.extname = ".scss";
                return paths;
            }
        }))
        .pipe(gulp.dest('src/sass'));
});

gulp.task('gen:popup', function(done) {
    var fileContent = fs.readFileSync("src/data/colors.json", "utf8");
    var fileContent2 = fs.readFileSync("src/data/custom.json", "utf8");
    var fileTpl = fs.readFileSync("src/template/popup.tpl", "utf8");
    var tmpl = template(fileTpl);
    fileContent = JSON.parse(fileContent).concat(JSON.parse(fileContent2));
    fs.writeFile("./src/popup.html", tmpl({ colors: fileContent }), function(err) {
        if (err) return console.log(err);
        done();
    });
})




gulp.task('gen:css', ['gen:scss'], function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/skins'));
});


gulp.task('gen:stylejs', ['gen:css'], function() {
    return gulp.src('src/skins/**/*.css')
        .pipe(css2jsmap({
            prefix: 'var colorsStyle = ',
            path: "colorstyle.js",
        }))
        .pipe(gulp.dest('src/content'));
})



gulp.task('dist:locales', function() {
    return gulp.src(['src/_locales/**/*.json'], { base: 'src' })
        .pipe(jsonminify())
        .pipe(gulp.dest('dist'));
})


gulp.task('dist:manifest', function() {
    return gulp.src(['src/manifest.json'], { base: 'src' })
        .pipe(jsonminify()) // remove comment
        .pipe(jeditor(function(json) {
            var bgscripts = json.background.scripts;
            bgscripts.forEach(function(item, index, all) {
                if (~item.indexOf('reload')) {
                    bgscripts.splice(index, 1);
                }
            })
            json.background.scripts = bgscripts;
            return json;
        }))
        .pipe(jsonminify())
        .pipe(gulp.dest('dist'));


})


gulp.task('dist:js', function() {
    return gulp.src(['src/content/*.js', 'src/vendor/*.js', 'src/bg/*.js', 'src/popup/*.js', 'src/options/*.js'], { base: 'src' })
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
})

gulp.task('dist:image', function() {
    return gulp.src(['src/images/*', 'src/icons/**/*'], { base: 'src' })
        // .pipe(imagemin())
        .pipe(gulp.dest('dist'));
});


gulp.task('dist:html', function() {
    return gulp.src(['src/options.html', 'src/popup.html'], { base: 'src' })
        .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true }))
        .pipe(gulp.dest('dist'));
});



gulp.task('gen', ['gen:stylejs', 'gen:popup']);

gulp.task('clean', function() {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});




gulp.task('dist', ['dist:locales', 'dist:manifest', 'dist:js', 'dist:html', 'dist:image']);


gulp.task('crx', function() {
    return gulp.src('dist/.')
        .pipe(crx({
            privateKey: fs.readFileSync(path.join(__dirname, "key.pem")),
            filename: 'cozhihu.crx'
        }))
        .pipe(gulp.dest('./build'));
});



gulp.task('build', function(done) {
    runSequence('clean', 'gen', 'dist',
        'crx',
        done);
})


gulp.task('autoreload', function() {
    crxAutoReload({
        extensionDir: "./src"
    });
})

gulp.task('dev', function(done) {
    runSequence('clean', 'gen',
        'autoreload',
        done);
});


gulp.task('watch', function() {
    return gulp.watch(paths.tmpl, ['dev'])
})
