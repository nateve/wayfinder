"use strict";

var ChooseLocView = Backbone.View.extend({
	initialize: function() {
		var that = this;
		require(['text!chooseLoc.html'], function(t) {
			that.template = t;
			console.log("that template = " + that.template);
			that.render();
		});
	},
	el: '#_el',
	events: {
		'change #lib-multi-select': 'choose',
	},
	render: function () {
		//var template = _.template($("#library-choose-template").html(), {});
		//console.log("this template = " + this.template);
		this.$el.html(_.template(this.template, {}));
		this.locations = [];
		var that = this;
		/* //this code may be useful later when the list of locations will be fetched from the server. DON'T REMOVE
		chooseLocCol.fetch({
			success: function (res) {
				var $select = $("#lib-multi-select");
				$select.append('<option value=""></option>');
				res.each(function(location) {
					if(location.get("code").indexOf("uiu") != -1) {
						var newOpt = $("<option />", {value: location.get("code")}).text(location.get("label"));
						$select.append(newOpt);
					}
				});
				$('.chosen-select').chosen({});
			},
			error: function(wat) {
				console.log("there was an error", wat);
			}
		});*/
		var $select = $("#lib-multi-select");
		$select.append('<option value=""></option>');
		for(var key in locations) {
			if(locations.hasOwnProperty(key)) {
				var newOpt = $("<option />", {value: key}).text(locations[key]);
				$select.append(newOpt);
			}
		}
		$('.chosen-select').chosen({});
	},
	choose: function(res) {
		router.navigate("loc/"+$(res.target).chosen().val(), {trigger: true});
	}
});