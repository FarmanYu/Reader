/****
 * @classDescription {reader} xss reader
 */
var Storage = require("./storage");
var FeedParser = require('feedparser');
var request = require('request');
var path = require("path");
var md5 = require("blueimp-md5").md5;
var tool = require("underscore");
var FeedCachePath = __dirname + path.sep + "cache.json";
var FeedListPath = __dirname + path.sep + "list.json";

var Reader = function(opt){
  this.model = "";
  this.url = "";
  tool.extend(this, opt);
};
Reader.prototype = {
  getFeedList: function(){
    var url = this.url;
    if(!/^http:\/\//ig.test(url)){
        throw new Error("the url was error!!!");
        return;
    }
    if(this.model == ""){
        throw new Error("the model was empty!!!");
        return;
    }
    var self = this;
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
        meta = this.meta, // **NOTE** the "meta" is always available in the context of the feedparser instance
        item;

      while (item = stream.read()) {
        if (tool.isObject(item)) {
          console.log(item.title);
          var article = {};
          article.title = item.title;
          article.description = item.description;
          article.link = article.link;
          article.pubDate = article.pubDate;

          var objectToString = JSON.stringify(article);
          article.id = md5(objectToString);
          RssContent.add(article, function(data) {
            RssList.add({
              title: data.title,
              id: data.id,
              model: self.model
            });
          });
        }
      }
    });
  },
  getFeedDetail: function(id) {

  }
};

module.exports = Reader;