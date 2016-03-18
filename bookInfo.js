"use strict";

var MapModel = Backbone.Model.extend({
	urlRoot:'http://minrva-dev.library.illinois.edu/api/wayfinder/map_data',
	url: function() {
		return this.urlRoot + this.instanceUrl;
	},
	changeParams: function(id) {
		this.instanceUrl = '/' + this.get("location") + "/" + this.get("bibID");
	}
});

var MapView = Backbone.View.extend({
	initialize: function(){	
		var temp;
		var that = this;
		require(['text!bookInfoT.html'], function(t) {
			that.template = t;
			that.doQuery();
		});
		this.message = "I don't know what to write here"; //believe in yourself. be confident.
	},
	el: '#_el',
	events: {
		'click #call-number': 'topSpace',
		'click #title-click': 'showFullTitle',
		'click #title-hidden': 'hideFullTitle',
		'click #summary': 'showSummary',
		//'click #fade': 'hideSummary',
		'click #shelf-click': 'showShelf',
		'click #shelf-hidden': 'hideShelf'
		//'click #map-image': 'box'
	},
	//console.log(callNumvar),
	render: function () {
		var temp = _.template(this.template);
		this.$el.html(temp({model:mapModel}));

		//if the user is looking at a book in undergrad then the topic space button will appear
		console.log(mapModel.location);
		console.log(mapModel.format);
		if (mapModel.location == "uiu_undergrad" && mapModel.format == "Book")
		{
			$("#ts-button").show();
			console.log("mapModel.location actually equals uiu_undergrad and mapModel.format actually equals Book");
			
		}
	},
	doQuery: function() {
		this.messsage = "Sorry... What you were looking for could not be found.";
		mapModel.changeParams();
		var that = this;
		//callNumvar = mapModel.get("call_num");
		mapModel.fetch({
			success: function (res) {
				if(mapModel.get("map_name") == undefined) {
					console.log("the item was not found in the database. sry.");
				//that.template = that.initialT;
				that.render();
				} else {
					that.render();
					that.updateImage(mapModel.get("map_name"));
					$("#map-image-link").fancybox({
		            overlay : {
			                css : {
			                    'background' : 'rgba(58, 42, 45, 0.95)'
			                }
		           		}
		        	});
				}

			},
			error: function(wat) {
				console.log("some error occured");
			}
		});
		return false; // prevents the browser from redirecting to path
	},
	updateImage: function(mapName) {
		//http://minrva.library.illinois.edu/api/wayfinder/map/13_stacks.png?x=943&y=977
		var newUrl = 'http://minrva-dev.library.illinois.edu/api/wayfinder/map/' + mapName + '?x=' + mapModel.get('x') + '&y=' + mapModel.get('y');
		$("#map-image-img").attr("src", newUrl);
		$("#map-image-link").attr("href", newUrl);
		//$("#map-span").attr("style", "background:url(" + newUrl + ") no-repeat");
		var bib_id3 = document.getElementById('bib-id').innerHTML;
		console.log( bib_id3 );
		var url = "http://minrva-dev.library.illinois.edu/api/display/" + bib_id3;
		console.log( url );
		$.getJSON(url , function(obj) {
			$("#book-image3").attr("src", obj.thumbnail);
			$('img').error(function(){
		        $(this).attr('src', 'no_photo_copy.jpg');
		    });
			$('#light').append("<h3>Summary</h3>" + obj.summary);
			if(!obj.summary)
				$('#light').append("<h3>Summary</h3><h4><em>There is no summary data available for this title.</em></h4>");
		});
		//document.getElementById("book-image3").innerHTML="<img src=\"" + obj.thumbnail + "\" id = \"test\" class=\"rounded-img\"style=\"margin: auto; min-width: 150px; max-width: 200px;\" alt = \"" +obj.title+ "\" align = \"middle\" onerror=\"this.src='no_photo.jpg';\" >"});
	},
	topSpace: function(obj) {
		console.log(mapModel.get("call_num"));
		router.navigate("loc/"+"uiu_undergrad"+"/callnum/search/format/"+ mapModel.get("call_num"), {trigger: true});
		//x = $(obj.target).closest(".item").attr("value");
		obj.preventDefault();
		console.log("topSpace");
	},
	showFullTitle: function() {
		$("#title-click").hide();
		$("#title-hidden").show();
	},
	hideFullTitle: function(){
		$("#title-hidden").hide();
		$("#title-click").show();
	},
	showSummary: function() {
		$('#light').fadeIn();
		$('#fade').fadeIn();
		$( ".cross" ).mousedown( function(){
			$('#light').fadeOut();
			$('#fade').fadeOut();
		});
	},
	hideSummary: function() {
		$('#light').fadeOut();
		$('#fade').fadeOut();
	},
	showShelf: function() {
		$("#shelf-click").hide();
		$("#shelf-hidden").show();
	},
	hideShelf: function(){
		$("#shelf-hidden").hide();
		$("#shelf-click").show();
	},
	box: function(){
		$("#map-image").fancybox({
            overlay : {
                css : {
                    'background' : 'rgba(58, 42, 45, 0.95)'
                }
            }
        });
	}
});