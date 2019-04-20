/// <binding BeforeBuild='build' ProjectOpened='default' />
// 引入 gulp
//var gulp = require('gulp');
//var $ = require('gulp-load-plugins')();
//var connect = require('gulp-connect');
var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var $ = require('gulp-load-plugins')();
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var rtlcss = require("gulp-rtlcss");
var connect = require('gulp-connect');
var concat = require('gulp-concat');

gulp.task('localhost', function() {
    connect.server();
});
gulp.task('server', function() {
    connect.server({
        port:1112,
        livereload: true,
    });
});

gulp.task('change', function () {
    // 监听文件变化
    gulp.watch(['assert/js/*/*','modules/*/*','template/*'], ['build']);
});

gulp.task('build', function () {
    gulp.src(['modules/*/*.js', 'template/*.js'])
        .pipe($.concat('angular-controller.js'))
        .pipe(gulp.dest('assets/js'));

    gulp.src('assets/js/service/*.js')
        .pipe($.concat('angular-service.js'))
        .pipe(gulp.dest('assets/js'));

    gulp.src('assets/js/directive/*.js')
        .pipe($.concat('angular-directive.js'))
        .pipe(gulp.dest('assets/js'));

    gulp.src('assets/js/filter/*.js')
        .pipe($.concat('angular-filter.js'))
        .pipe(gulp.dest('assets/js'));
});

gulp.task('watch', function () {
    gulp.watch(['./modules/*/*.html','./modules/*/*.js', './assets/js/*/*.js','./template/*/*.html','./template/*/*.js'], ['build','reload']);
});

gulp.task('reload', function () {
	console.log('now reload *.js')
/*	gulp.src('assets/js/service/*.js')
		.pipe($.concat('angular-service.js'))
		.pipe(gulp.dest('assets/js'));*/
//	gulp.src('modules/*/*.js')
//		.pipe($.concat('angular-controller.js'))
//		.pipe(gulp.dest('modules'));
//	gulp.src('template/*.js')
//		.pipe($.concat('angular-controller.js'))
//		.pipe(gulp.dest('template'));
//	gulp.src('assets/js/directive/*.js')
//		.pipe($.concat('angular-directive.js'))
//		.pipe(gulp.dest('assets/js'));
//	gulp.src('assets/js/filter/*.js')
//		.pipe($.concat('angular-filter.js'))
//		.pipe(gulp.dest('assets/js'));
});


gulp.task('default',['server','build','watch','change','reload'])


