"use strict"; // just a test

var serverLink = "http://minrva.library.illinois.edu";

var locations = [];
locations['uiu_stacks'] = "University of Illinois at Urbana-Champaign >> Main Stacks";
locations['uiu_aces'] = "University of Illinois at Urbana-Champaign >> ACES";
locations['uiu_musicperf'] = "University of Illinois at Urbana-Champaign >> Music & Perf. Arts";
locations['uiu_undergrad'] = "University of Illinois at Urbana-Champaign >> Undergrad.";

var mapModel, mapView; 

var topicSpaceModel, topicSpaceView;

var chooseLocCol, chooseLocView;

var bookChooseModel, bookChooseView;

var Router = Backbone.Router.extend({
		routes: {
			"": "locationChoose",
			"loc/:location": "bookChoose",
			"loc/:location/:query": "bookChoose",
			"loc/:location/:query/:itemID/:format": "bookInfo",
			"loc/:location/:query/:itemID/:format/:callNum": "topicSpace"//"loc/:location/"query/:callNumber/topic-space": "topicSpace"
		}
});
f
var router = new Router();

router.on('route:locationChoose', function() {
	$("#_el").empty();
	$('#toptitle').html("not defined");
	$('#toptitle').attr("href", "#");
	chooseLocCol = new Backbone.Collection();
	chooseLocCol.url = 'http://minrva.library.illinois.edu/api/locations/list';
	chooseLocView = new ChooseLocView();

	bookChooseModel = null;
});

router.on('route:bookChoose', function(location, query){
	console.log("query: " + query);
	$("#_el").empty();
	if(!bookChooseModel) {
		console.log("bookchoosemodel doesn't exist");
		bookChooseModel = new BookChooseModel({loc: location, que: query}); 
		bookChooseModel.location = location;
		bookChooseView = new BookChooseView();
	} else {
		console.log("choosebookcoll exists");
		bookChooseModel.location = location;
	}
	$('#toptitle').html("" + locations[location]);
	$('#toptitle').attr("href", "index.html#loc/" + location); //this stuff is constructing the url
	if(query != undefined) {
		query = query.split("+");
		bookChooseView.query = query[0];
		bookChooseView.type = query[1];
		bookChooseView.format = query[2];
		bookChooseView.page = query[3];
		bookChooseView.doQuery(query[0], query[1], query[2]);
	} else {
		bookChooseView.query = null;
	}
	bookChooseView.render();
}); 

router.on('route:bookInfo', function(location, query, itemID, format) {
	$('#toptitle').html("" + locations[location]);
	$("#_el").empty();
	mapModel = new MapModel({location: location, query: query, bibID:itemID, format: format});
	mapModel.location = location;
	mapModel.format = format;
	mapView = new MapView();
});



router.on('route:topicSpace', function(location, query, itemID, format, callNum) {
	$('#toptitle').html("" + locations[location]);
	$("#_el").empty();
	topicSpaceModel = new TopicSpaceModel({location: location, callNumVar: callNum});
	topicSpaceView = new TopicSpaceView();
});

Backbone.history.start();

require.config({
	paths: {
	  'text': 'text',
	},
});
