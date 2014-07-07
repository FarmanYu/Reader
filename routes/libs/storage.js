/***
 * @classDescription {storage} data storage
 *
 */
var md5 = require("blueimp-md5").md5;
//var tool = require("underscore");
var fsManger = require("./fsManger");

var Storage = function(filename, options) {
	this.filename = filename;
	//tool.extend(this, options);
};
Storage.prototype = {
	/**
	 * id {param} md5 string
	 * [callback]
	 **/
	get: function(id, callback) {
		fsManger.read(this.filename, function(err, data) {
			if (err) {
				console.log(err);
				return
			}
			var dataList = JSON.parse(data) || [];
			for (var i = 0; i < dataList.length; i++) {
				if (dataList[i]._id === id) {
					callback(dataList[i]);
				}
			}
		});
	},
	/**
	 * data {param} object
	 **/
	add: function(data, callback) {
		var content = fsManger.read(this.filename) || "[]";
		content = JSON.parse(content);
		content.push(data);
		content = JSON.stringify(content, null, 4);
		fsManger.push(this.filename, content, function(err, d) {
			if (err) {
				console.log(err);
				return
			}
			callback && callback(data);
		});
	}
}
module.exports = Storage;