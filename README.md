(PLUGIN AUTHOR: Please read [Plugin README conventions](https://github.com/wearefractal/gulp/wiki/Plugin-README-Conventions), then delete this line)

# gulp-translation-tool-srt
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> <%= pluginName %> plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-translation-tool-srt` as a development dependency:

```shell
npm install --save-dev gulp-translation-tool-srt
```

Then, add it to your `gulpfile.js`:

```javascript
var gulpTranslationToolSRT = require("gulp-translation-tool-srt");

gulp.src("./src/*.ext")
	.pipe(gulpTranslationToolSRT({
		msg: "Hello Gulp!"
	}))
	.pipe(gulp.dest("./dist"));
```

## API

### gulpTranslationToolSRT(options)

#### options.msg
Type: `String`
Default: `Hello World`

The message you wish to attach to file.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)