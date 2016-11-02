var gulp = require('gulp'),
	less = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
	cssmin = require('gulp-minify-css'),//css压缩
	imagemin = require('gulp-imagemin'), //图片压缩
	pngcrush = require('imagemin-pngcrush'),
	jshint = require('gulp-jshint'), //js检测
	uglify = require('gulp-uglify'), //js压缩
	concat = require('gulp-concat'), //文件合并
	rename = require('gulp-rename'), //文件更名
	htmlmin = require('gulp-htmlmin'), //html压缩
	notify = require('gulp-notify'), //提示信息
    connect = require("gulp-connect");
 



//使用connect启动一个Web服务器
gulp.task('connect', function () {
  connect.server({
    root: './www/',
    livereload: true,
    port: 98
  });
});

gulp.task('html', function () {
  gulp.src('./www/*.html')
    .pipe(connect.reload());
});



// 合并、压缩、重命名css
gulp.task('less', function() {
	gulp.src('src/assets/css/ju.less')
		//.pipe(concat('ju.css')) // 合并文件为ju.css
		.pipe(less())
		.pipe(gulp.dest('./www/css'))
		.pipe(connect.reload())
	    //.pipe(rename({ suffix: '.min' })) // 重命名ju.css为 ju.min.css
        //.pipe(cssmin()) // 压缩css文件
        //.pipe(gulp.dest('./www/css/')) // 输出all.min.css
	    .pipe(notify({
		    message: 'css task ok'
	    }));
});

// 压缩html
// gulp.task('html', function() {
// 	return gulp.src('./dist/*.html')
// 		.pipe(htmlmin({
// 			collapseWhitespace: true
// 		}))
// 		.pipe(gulp.dest('./dist'))
// 		.pipe(notify({
// 			message: 'html task ok'
// 		}));
// });

// 压缩图片
gulp.task('img', function() {
	return gulp.src('src/assets/images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngcrush()]
		}))
		.pipe(gulp.dest('www/images/'))
		.pipe(notify({
			message: 'img task ok'
		}));
});

// 检查js
gulp.task('lint', function() {
	return gulp.src('src/assets/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(notify({
			message: 'lint task ok'
		}));
});

// 合并、压缩js文件
gulp.task('js', function() {
	return gulp.src([
		'src/assets/js/intro.js',
        'src/assets/js/util.js',
        'src/assets/js/zepto-adapter.js',
        'src/assets/js/device.js',
        'src/assets/js/fastclick.js',
        'src/assets/js/swiper.js',
        'src/assets/js/*.js',
        
		])
		.pipe(concat('ju.js'))
		.pipe(gulp.dest('www/js'))
		.pipe(connect.reload())
		//.pipe(rename({
		//	suffix: '.min'
		//}))
		//.pipe(uglify())
		//.pipe(gulp.dest('dist/js'))
		.pipe(notify({
			message: 'js task ok'
		}));
});


// 默认任务
gulp.task('default', function() {
	gulp.run('connect','img', 'less', 'js', 'html');

	// 监听html文件变化
	gulp.watch('./www/*.html', function() {
		gulp.run('html');
	});

	// Watch .css files
	gulp.watch('src/assets/css/*.less', function() {
		gulp.run('less');
	});

	// Watch .js files
	gulp.watch('src/assets/js/*.js', function() {
		gulp.run('js');
	});

	// Watch image files
	gulp.watch('src/assets/images/*', ['img']);
});