/****
 * @classDescription {reader} xss reader
 */
var Storage = require("./storage");
var FeedParser = require('feedparser');
var request = require('request');
var path = require("path");
var md5 = require("blueimp-md5").md5;
var FeedCachePath = process.cwd() + path.sep + "cache.json";
var FeedListPath = process.cwd() + path.sep + "list.json";

var Reader = {
  getFeedList: function(url, callback) {
    var req = request(url);
    var feedparser = new FeedParser();
    var RssContent = new Storage(FeedCachePath);
    var RssList = new Storage(FeedListPath);

    req.on('error', function(error) {
      console.log("%s- request Fail!", url);
      console.log(error);
    });
    req.on('response', function(res) {
      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser);
    });

    feedparser.on('error', function(error) {
      console.log("%s -FeedParser Fail!", url);
      console.log(error);
    });
    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this,
        meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        ,
        item;

      while (item = stream.read()) {
        var objectToString = JSON.stringify(item);
            item.id = md5(objectToString);
        RssContent.add(item, function(data) {
          RssList.add({
            title: data.title,
            index: data.id
          });
        });
      }
    });
  },
  getFeedDetail: function(id) {

  }
};

module.exports = Reader;