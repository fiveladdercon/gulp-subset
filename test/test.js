var subset    = require('../');
var path      = require('path');
var expect    = require('chai').expect;
var Transform = require('stream').Transform;
var File      = require('gulp-util').File;

describe('gulp-subset', function () {

	// Pipe input utils

	function open() {
		var args = []; for(var i=0;i<arguments.length;i++) args[i] = arguments[i];
		return new File({
			path     : path.join(__dirname,args.shift()),
			contents : args.length ? new Buffer(args.join('')) : null
		});
	}

	var apple,banana,cherry;

	// Extra processing

	function extra() {
		return new Transform({
			objectMode: true,
			transform : function (file, encoding, next) {
				file.contents = Buffer.concat([file.contents,new Buffer('+')]);
				next(null,file);
			}
		}); 
	}

	// Pipe output utils

	var output;	

	function flush () {
	    apple  = open('apple.txt' ,'apple' );
	    banana = open('banana.txt','banana');
  	    cherry = open('cherry.txt','cherry');
		output = [];
	}

	function queue (file) {
		output.push(file.contents.toString()); 
	}

	// Tests

	describe('when correctly used', function () {

		beforeEach(flush);

		it('splits the stream based on a regex pattern, processing matching files through the stream operation, while passing on the rest', function (done) {
			var stream  = subset(/banana/,extra());
			stream.on('data',queue);
			stream.write(apple);
			stream.write(banana);
			stream.write(cherry);
			stream.end(function () {
				expect(output).to.deep.equal(['apple','banana+','cherry']);
				done();
			});
		});

		it('splits the stream based on a string pattern, processing matching files through the stream operation, while passing on the rest', function (done) {
			var stream  = subset('banana',extra());
			stream.on('data',queue);
			stream.write(apple);
			stream.write(banana);
			stream.write(cherry);
			stream.end(function () {
				expect(output).to.deep.equal(['apple','banana+','cherry']);
				done();
			});
		});

		it('splits the stream based on a function, processing matching files through the stream operation, while passing on the rest', function (done) {
			var stream  = subset(function (file) { return file.relative.match(/banana/); },extra());
			stream.on('data',queue);
			stream.write(apple);
			stream.write(banana);
			stream.write(cherry);
			stream.end(function () {
				expect(output).to.deep.equal(['apple','banana+','cherry']);
				done();
			});
		});


		it('inverts the match when the last argument is true', function (done) {
			var stream = subset(/banana/,extra(),true);
			stream.on('data',queue);
			stream.write(apple);
			stream.write(banana);
			stream.write(cherry);
			stream.end(function () {
				expect(output).to.deep.equal(['apple+','banana','cherry+']);
				done();
			});
		});

	}); /* when correctly used */

	describe('when incorrectly used', function () {

		beforeEach(flush);

		it('throws an error if no options are passed', function () {
			expect(subset).to.throw('Missing pattern');
		});

		it('throws an error if the pattern is not a string, regex or function', function () {
			expect(function () { 
				subset([],extra());
			}).to.throw('Pattern must be a string, regex or function');
		});

		it('throws an error if the stream operator is missing', function () {
			expect(function () { 
				subset(/banana/);
			}).to.throw('Missing stream operation');
		});

		it('throws an error if the stream operator isn\'t actually a stream', function () {
			expect(function () { 
				subset(/banana/,function () {});
			}).to.throw('Stream operation does not appear to be writeable');
		});

	}); /* when incorrectly used */

});