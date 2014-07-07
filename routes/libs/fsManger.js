/**
 * @classDescription file manger
 */

var fs = require("fs"),
	tool = require("underscore"),
	FileManger = {};
FileManger = {
	read: function(filename, callback, options) {
		var opt = options || {};
		opt = tool.extend({
			encoding: "utf8"
		}, opt);
		if(!this.isFile(filename)){
			this.touchFile(filename);
		}
		if (typeof callback == 'function') {
			fs.readFile(filename, opt, callback);
		} else {
			return fs.readFileSync(filename, opt);
		}
	},
	isFile: function(filename) {
		var isFile = false;
		try{
			var stat = fs.statSync(filename);
			isFile = stat && stat.isFile();
		}catch(e){

		}
		return isFile;
	},
	touchFile: function(filename) {
		fs.appendFileSync(filename,"[]");
	},
	push: function(filename, data, callback, options) {
		var opt = options || {};
		opt = tool.extend({
			encoding: "utf8"
		}, opt);
		if (typeof callback == 'function') {
			fs.writeFile(filename, data, opt, callback);
		} else {
			return fs.writeFileSync(filename, data, opt);
		}

	}
}

module.exports = FileManger;