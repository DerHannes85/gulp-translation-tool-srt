# gulp-translation-tool-srt

> gulp-translation-tool-srt plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-translation-tool-srt` as a dependency:

```shell
npm install gulp-translation-tool-srt
```

Then, add it to your `gulpfile.js`:

```javascript
var gulpTranslationToolSRT = require("gulp-translation-tool-srt");

gulp.src('./data/*.srt')
    .pipe(gulpTranslationToolSrt({
        mode: 'toXML',
        name: function (basename) {
            return basename + '-done';
        }
    }))
    .pipe(gulp.dest('./data/output/'));
```

## API

### gulpTranslationToolSRT(options)

#### options.mode
Type: `String`
Default: `toXML`

Switch the direction of the conversion between `toXML` and `toSRT`.

#### options.name
Type: `String|Function`

Rename the filename of the output use string or return function.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)