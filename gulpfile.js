var gulp = require('gulp');
var notify=require('gulp-notify');
var zip=require('gulp-zip');
var clean=require('gulp-clean');
var filter = require('gulp-filter');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var precss = require('precss');
var reset = require('postcss-css-reset');
var utils = require('postcss-utils');
var bem = require('saladcss-bem');
var nested = require('postcss-nested');
var shape = require('postcss-shape');
var cssnano = require('cssnano');
var pxtorem = require('postcss-pxtorem');

var uglify= require('gulp-uglify');

var imagemin = require('gulp-imagemin');

var processors=[
        precss,
        reset,
        utils,
        nested,
        shape,
        pxtorem({
                rootValue: 750,
                unitPrecision: 5,
                propList: ['*','!font', '!font-size'],
                selectorBlackList: [],
                replace: true,
                mediaQuery: false,
                minPixelValue: 1
            }),
        bem({
            defaultNamespace: 'i', // default namespace to use, none by default
            style: 'suit', // suit or bem, suit by default
            shortcuts: {
                "component": "b",
                "modifier": "m",
                "descendent": "e"
            },
            separators: {
                "descendent": "_",
                "modifier": "__"
            }
        }),
        // cssnano
    ];

var _path={
    src:['./src/**/*.*','!**/origin/*.*'],
    filterJs:['./src/*.js'],
    style:['./src/style/origin/*.scss','!./src/style/origin/base.scss'],
    html:'./src/index.html',
    js:'./src/js/*.js',
    img:'./src/img/*.(png,jpg)',
    dist:'./dist/',
    cssDist:'./src/style/'
};
var zipName ='ycshare.zip';
// 清除旧文件
gulp.task('clean',function(){
    return gulp.src('./dist/',{read:false})
        .pipe(clean())
        .pipe(notify({message:'清除完成！'}))
});

gulp.task('style',function(){
    return gulp.src(_path.style)
    .pipe(sass().on('error', sass.logError))  //用css 此行注释掉
    .pipe(postcss(processors))
    .pipe(gulp.dest(_path.cssDist));
})


gulp.task('js', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulp.dest(_path.dist));
});


gulp.task('img', function () {
    gulp.src(_path.img)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(_path.dist));
});


gulp.task('css', function () {
    gulp.watch(_path.style, ['style']);
});

var filterJs=filter(_path.filterJs, {restore: true});
var filterCss=filter('_path.style', {restore: true});

gulp.task('default',['clean'],function(){
    gulp.src(_path.src)
    // .pipe(filterJs)
    // .pipe(rename({suffix:'.min'}))
    // .pipe(uglify())
    // .pipe(notify({message:'js压缩完成！'}))
    // .pipe(filterJs.restore)
    // .pipe(filterCss)
    .pipe(zip(zipName))
    .pipe(gulp.dest(_path.dist))
    .pipe(notify({message:'zip包完成，输出文件夹 export！'}))
})
