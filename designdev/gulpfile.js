var gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	pug           = require('gulp-pug'), // pug
	htmlbeautify  = require('gulp-html-beautify'), // htmlファイルの整形（pugで生成したhtmlのインデントをタブ化）
	sourcemaps    = require('gulp-sourcemaps'), // ソースマップの書き出し
	bourbon       = require('node-bourbon'), // sass用のmixin/functionsをまとめたcssのフレームワーク
	notify        = require('gulp-notify'), // gulpタスク実行中にエラーが出たらデスクトップ通知を出す
	plumber       = require('gulp-plumber'), // エラーが出たときにgulpを終了させない
	autoprefixer  = require('autoprefixer'), // ベンダープレフィックスをCan I Useのデータを元に自動的に付与、または不必要なプレフィックスを削除(PostCSSプラグイン)
	mqpacker      = require('css-mqpacker'), // メディアクエリをまとめてくれる(PostCSSプラグイン)
	postcss       = require('gulp-postcss'), // PostCSS単体では特に無し。autoprefixerなどのプラグインと一緒に使う。
	browserSync   = require('browser-sync'), // ローカルホストを立てて、かつ各ブラウザで同じ画面見せる
	styleguide    = require('sc5-styleguide'), // スタイルガイドを作る
	merge         = require('merge-stream'); // 1つのtaskで複数のsrcを扱う

// bourbon
// ------------------------------------------
bourbon.with('./scss/**/*.scss'); // bourbon.includePathsに入る

// Sass コンパイル
// ------------------------------------------
gulp.task('sass', function(){
	var processors = [
		autoprefixer({browsers: ['last 2 versions']}),
		mqpacker({sort: false})
	];

	gulp.src('./scss/**/*.scss')
	.pipe(plumber({
		errorHandler: notify.onError("Error: <%= error.message %>")
	}))
	.pipe(sass({
		includePaths: bourbon.includePaths
	}))
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) //出力形式の種類  #nested, compact, compressed, expanded
	.pipe(postcss(processors))
	.pipe(sourcemaps.init())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('../docs/css'));
});

// pug コンパイル
// ------------------------------------------

gulp.task('pug', function buildHTML() {
	return gulp.src(['./pug/**/*.pug', '!./pug/**/_*.pug'])
	.pipe(plumber({
		errorHandler: notify.onError("Error: <%= error.message %>")
	}))
	.pipe(pug({
		pretty: true,
		basedir: __dirname + '/pug'
	}))
	.pipe(htmlbeautify({
		"indent_with_tabs": true
	}))
	.pipe(gulp.dest('../docs/'));
});

// BrowserSync
// ------------------------------------------
gulp.task('bs', function () {
	browserSync({
		server: {
			baseDir: '../docs/',
		}
	});
});

// スタイルガイド生成
// ------------------------------------------
var outputPath = 'styleguide';
gulp.task('styleguide:generate', function() {
	return gulp.src('./scss/**/*.scss') // スタイルガイドを作るものを指定
		.pipe(styleguide.generate({
		title: 'スタイルガイド', // スタイルガイドのタイトル
		server: true,
		port: 4000, // localhostのポート。デフォルトは3000
		rootPath: outputPath,
		sideNav: true, // ナビゲーション位置。trueで左側、falseで上
		overviewPath: 'styleguide/overview.md' // トップページになる概要の書き出し位置
	}))
		.pipe(gulp.dest(outputPath));
});
gulp.task('styleguide:applystyles', function() {
	return gulp.src('./scss/style.scss') // スタイルガイドで表示する(s)cssを指定
		.pipe(sass({
		errLogToConsole: true,
		includePaths: require('node-bourbon').includePaths // scss内のbourbonをスタイルガイドでも読み込ませる
	}))
		.pipe(styleguide.applyStyles())
		.pipe(gulp.dest(outputPath));
});
gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

// 変更ファイルの監視
// ------------------------------------------
gulp.task('watch', ['bs', 'styleguide'], function () {
	gulp.watch([
		'../docs/**/*.html',
		'../docs/css/**/*.css',
		'../docs/js/**/*.js',
		'../docs/img/**/*'
	]).on('change', browserSync.reload);
	gulp.watch('./scss/**/*.scss', ['sass']);
	gulp.watch('./pug/**/*.pug', ['pug']);
	gulp.watch('./scss/**/*.scss', ['styleguide']);
});

// gulpのデフォルト動作
// ------------------------------------------
gulp.task('default', ['bs', 'watch', 'sass', 'pug', 'styleguide']);