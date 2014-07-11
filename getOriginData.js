var RssOrigin = require("./routes/libs/rssorigin");
var RssReader = require("./routes/libs/reader");

for(var rss in RssOrigin){
	var rssIntance = new RssReader({
		model : rss,
		url : RssOrigin[rss]
	});
	rssIntance.getFeedList();
}