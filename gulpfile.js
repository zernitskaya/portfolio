const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
// const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();
const ghPages = require("gulp-gh-pages");

const paths = {
  scripts: {
    src: "./",
    build: "./build",
  },
};

// Styles

const styles = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// HTML

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// exports.html = html;

//Scriptc

const scripts = () => {
  return (
    gulp
      .src("source/*.js")
      // .pipe(uglify())
      .pipe(rename("script.min.js"))
      .pipe(gulp.dest("build/js"))
      .pipe(sync.stream())
  );
};

exports.scripts = scripts;

// Images

const images = () => {
  return gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest("build/img"));
};

exports.images = images;

//Webp

const createWebp = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
};

exports.createWebp = createWebp;

//Sprite

const sprite = () => {
  return gulp
    .src("source/img/icons-sprite/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/sprite"));
};

exports.sprite = sprite;

//Copy

const copy = (done) => {
  gulp
    .src(
      [
        "source/fonts/*.{woff2,woff}",
        "source/*.ico",
        "source/img/**/*.{jpg,png,svg}",
        "source/works/**/*",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

exports.copy = copy;

//clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html), sync.reload);
};

//build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    // scripts,
    sprite,
    copy,
    images,
    createWebp
  )
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  gulp.parallel(styles, html, scripts, sprite, copy, createWebp),
  gulp.series(server, watcher)
);

gulp.task("deploy", function () {
  return gulp.src("./build/**/*").pipe(ghPages());
});
