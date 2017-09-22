'use strict';

var Stream = require('stream');
var Path = require('path');
var gutil = require('gulp-util');
var readLine = require('linebyline');

function gulTtranslationToolSrt(options)
{

    options.mode = options.mode || 'toXML';

    var stream = new Stream.Transform({objectMode: true}),
        lastWasTextLine = false;

    function parsePath(path)
    {
        var extname = Path.extname(path);
        return {
            dirname: Path.dirname(path),
            basename: Path.basename(path, extname),
            extname: extname
        };
    }

    function returnNewFile(originalFile, extension, options, content, callback)
    {
        var parsedPath,
            basename,
            newFile,
            newFilePath;

        parsedPath = parsePath(originalFile.relative);

        switch (true)
        {
            case (typeof options.name === 'string' && options.name.length > 0):
                basename = options.name;
                break;
            case (typeof options.name === 'function'):
                basename = options.name(parsedPath.basename);
                break;
            default:
                basename = parsedPath.basename;
                break;
        }

        newFilePath = Path.join(parsedPath.dirname, basename + extension);

        newFile = new gutil.File({
            contents: new Buffer(content),
            path: Path.join('./', newFilePath)
        });

        // RETURN NEW FILE
        callback(null, newFile);

    }

    stream._transform = function (file, unused, callback) {

        var newFileExtension,
            newFileBuffer = '',
            readLineTool;

        switch (options.mode.toLowerCase())
        {
            case 'tosrt':
                // region TO SRT
                newFileExtension = '.srt';

                readLineTool = readLine(file.path);
                readLineTool.on('line', function (line, lineCount, byteCount) {

                    var myregexp,
                        match;

                    myregexp = /^\s*<text id="(\d+)" time="(\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d)"><!\[CDATA\[(.*)\]\]><\/text>$/g;
                    match = myregexp.exec(line);

                    while (match !== null && match.length === 4)
                    {
                        newFileBuffer += match[1] + '\r\n';
                        newFileBuffer += match[2] + '\r\n';
                        newFileBuffer += match[3].replace(/]]><br\/><!\[CDATA\[/g, '\r\n') + '\r\n';
                        newFileBuffer += '\r\n';

                        match = myregexp.exec(line);
                    }

                }).on('error', function () {

                    callback(new Error('gulp-translation-tool-srt | readline error'), undefined);

                }).on('end', function () {

                    returnNewFile(file, newFileExtension, options, newFileBuffer, callback);

                });
                break;
            // endregion

            case 'toxml':
            default:
                // region TO XML
                newFileExtension = '.xml';
                newFileBuffer += '<?xml version="1.0" encoding="utf-8"?>\r\n<languageData>\r\n\t<group name="' + parsePath(file.relative).basename + '">';

                readLineTool = readLine(file.path);
                readLineTool.on('line', function (line, lineCount, byteCount) {
                    switch (true)
                    {
                        case /^\s*(\d+)\s*$/.test(line):
                            // ID
                            newFileBuffer += '\r\n\t\t<text id="' + line.replace(/^\s*(\d+)\s*$/, '$1') + '"'; // Start <text/> node
                            lastWasTextLine = false;
                            break;
                        case /^(\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d)\s*$/.test(line):
                            // TIME
                            newFileBuffer += ' time="' + line.replace(/^(\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d)\s*$/, '$1') + '"><![CDATA['; // Write Time
                            lastWasTextLine = false;
                            break;
                        case /^\s*$/.test(line):
                            // EMPTY
                            if (lastWasTextLine === true)
                            {
                                newFileBuffer += ']]></text>';// Close <text/> node
                                lastWasTextLine = false;
                            }
                            break;
                        default:
                            // TEXT
                            if (/"><!\[CDATA\[$/.test(newFileBuffer))
                            {
                                newFileBuffer += ''; // Close <text_>_ node
                            } else
                            {
                                newFileBuffer += ']]><br/><![CDATA['; // new line
                            }
                            newFileBuffer += line;
                            lastWasTextLine = true;
                            break;
                    }

                }).on('error', function () {

                    callback(new Error('gulp-translation-tool-srt | readline error'), undefined);

                }).on('end', function () {
                    if (!/]]><\/text>$/.test(newFileBuffer))
                    {
                        newFileBuffer += ']]></text>';// Close <text/> node
                    }
                    newFileBuffer += '\r\n\t</group>\r\n</languageData>'; // END

                    lastWasTextLine = false;

                    returnNewFile(file, newFileExtension, options, newFileBuffer, callback);

                });

                break;
            // endregion
        }

    };

    return stream;
}

module.exports = gulTtranslationToolSrt;
