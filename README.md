# gulp-subset

Process a subset of files in a gulp pipeline.

## Install

```
> npm install gulp-subset
```

## Usage

gulp-subset uses a pattern to select a subset of files to process.
Files that match the pattern are passed to the processing step while
the remaining files just fall through to the next step.

```javascript
var subset = require('gulp-subset');

gulp.src(['*.css','*.less'])
	.pipe(subset(/less$/, less()))  // Pipe .less files through less()
	.pipe(cssmin())
	...
```

The pattern can be a string, regex or custom function.  Passing an extra
truthy value will invert the match:

```javascript
var subset = require('gulp-subset');

gulp.src(['*.css','*.less'])
	.pipe(subset(/css$/, less(), true))  // Pipe non .css files through less()
	.pipe(cssmin())
	...
```


## API

```javascript
subset(pattern, stream [,invert])
```

#### pattern : string | regex | function

The pattern is either a string, regex or function.  If it is a function, it is passed
a vinyl and must return true if the file is to be processed, false otherwise.  

Passing a string pattern is a convience for the following matching function:

```javascript
function (vinyl) { 
	return (vinyl.relative.indexOf(pattern)>=0)
}
```

Passing a regex pattern is a convience the following matching function:

```javascript
function (vinyl) {
	return (vinyl.relative.match(pattern))
}
```

#### stream

This is any operation that you would normally pass to the pipe() function.

#### invert

Passing a truthy value will invert the matching subset.

## Test

```
> npm test
```
