"use strict";

//uiu_6755932
var TopicSpaceModel = Backbone.Model.extend({
urlRoot:'http://minrva-dev.library.illinois.edu/api/ts/list?callnumber=', //the url that connects to the localhost and the api
		url: function(){
			console.log("Running API");
			$("#loader").fadeIn("slow");
			return this.urlRoot + this.instanceUrl;
		}, 
		changeParams: function(id) {
			this.instanceUrl = this.get("callNumVar") + '&manualsearch=&classification';		
			var cn = this.get("callNumVar");
		}
	});

var TopicSpaceView = Backbone.View.extend({
	initialize: function(){
		var temp;
		var that = this;
		require(['text!topicSpaceT.html'], function(t) {
        	that.template = t;
        	that.doQueryTS();
    	});
    	this.message = "I don't know what to write here"; //believe in yourself. be confident.
	},
	el: '#_el',
	render: function () {
		$("#loader").hide();
		var temp;
			temp = _.template(this.template)({model:topicSpaceModel});
		this.$el.html(temp);
                        var bib_id = document.getElementById('bib-id').innerHTML;
                        var url = "http://minrva-dev.library.illinois.edu/api/display/" + bib_id;
                        $.getJSON(url , function(obj) {
                            $("#book-image1").attr("src", obj.thumbnail);
                            //document.getElementById("book image").innerHTML="<center><img src='http://secure.syndetics.com/index.aspx?type=xw12&isbn=0062731653/LC.JPG&client=uillurch'></center>";
                        });

                    var bib_id2 = document.getElementById('bib-id2').innerHTML;
                    var url2 = "http://minrva-dev.library.illinois.edu/api/display/" + bib_id2;
                    console.log(url2);
                    $.getJSON(url2 , function(obj2) {
                        $("#book-image2").attr("src", obj2.thumbnail);
                    }); 
                                                        $('img').error(function(){
                                        $(this).attr('src', 'no_photo_copy.jpg');
                                    });
                    //$('book image').error(function(){
	},
	doQueryTS: function() {
		this.message = "Sorry... What you were looking for could not be found.";
		topicSpaceModel.changeParams();
		var that = this;
		topicSpaceModel.fetch({
			success: function() {
				console.log(topicSpaceModel);
				//console.log(topicSpaceModel.attributes[0]);
				//console.log(topicSpaceModel.attributes[0].authors.length);
				//console.log(topicSpaceModel.attributes[1]);
				that.render();
			},
			error: function() {
				console.log("topic space error");
			}
		});
		//topicSpaceModel.bookURlthing(bib_id0);
		//topicSpaceModel.bookURlthing(bib_id1);
		return false; // prevents the browser from redirecting to path
	}//,
	//bookURLthing: function(bib_id) {
	//	newUrl = 'http://localhost:8080/api/display/' + bib_id;
	//	console.log(this.get(thumbnail));
	//	$("#book0").attr("src", newUrl.thumbnail);
	//}
});