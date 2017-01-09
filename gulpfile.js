/**
 * Created by Yuan on 2016/7/16.
 */
let gulp = require('gulp');
let del = require('del'); //文件删除
let runSequence = require('run-sequence'); //异步任务
let gulpWatch = require('gulp-watch'); //监听插件
let uglify = require('gulp-uglify');
let nodemon = require('gulp-nodemon');
let gulpConcat = require('gulp-concat');

gulp.task('default', function () {
    nodemon({
        script: 'server.js',
        ignore:[
            'public/**', 
            'test/**',
            'webApp',
            'www',
            'node_modules',
            'uploads',
            'package.json',
            '.gitignore',
            'README.md',
            'mongodb'
        ]
    }).on('restart', function () {
        console.log('restarted!')
    });

    gulp.start('watch');
});

gulp.task('watch',function () {
    runSequence(['build'],function () {
        gulpWatch(['webApp/**'],function () {
            gulp.start('build');
        })
    })
});

gulp.task('clean', function(){
    return del('www/src');
});

gulp.task('build',['clean'],function () {
    return gulp.src('webApp/**')
        .pipe(gulp.dest('www/src/'))
});
