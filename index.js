var Transform   = require('stream').Transform;
var PluginError = require('gulp-util').PluginError;

module.exports = function (pattern,inner,invert)  {

	if (!pattern) throw new PluginError('gulp-subset','Missing pattern');

	var matching;

	switch(Object.prototype.toString.call(pattern)) {
		case '[object Function]' : matching = pattern;                                                         break;
		case '[object RegExp]'   : matching = function (file) { return (file.relative.match(pattern));      }; break;
		case '[object String]'   : matching = function (file) { return (file.relative.indexOf(pattern)>=0); }; break;
		default                  : throw new PluginError('gulp-subset','Pattern must be a string, regex or function');
	}

	if (!inner      ) throw new PluginError('gulp-subset','Missing stream operation');
	if (!inner.write) throw new PluginError('gulp-subset','Stream operation does not appear to be writeable');

	var outer = new Transform({ objectMode: true, transform: transform });

	function transform (file, encoding, next) {
		if (invert ? !matching(file) : !!matching(file)) {
			inner.write(file, encoding, function () { next(); });
		} else {
			next(null,file);
		}
	}

	inner.on('data', function (file) { 
		outer.push(file); 
	});

	return outer;

};