"use strict";

var BookChooseModel = Backbone.Model.extend({
	urlRoot:'http://minrva-dev.library.illinois.edu/api/catalog/search?loc=', 
	//+ this.get("loc") + '&query=' + this.get("que") + '&type=allpage=' + 1, 
	//'http://localhost:8080/MinrvaServices/wayfinder/map_data'
	//http://localhost:8080/api/catalog/search?loc=uiu_undergrad&query=cat&type=all&page=1&format=Book&filter[]=callnumber-first:%22%22
		url: function(){
			console.log("Running API");
			return this.urlRoot + this.instanceUrl;
		}, 
		changeParams: function(id, num, callnumtype){
				console.log("this is callnumbertype "+ callnumtype);
				this.instanceUrl =  this.get("loc") + '&query=' + bookChooseView.query + '&type=' + this.type + '&page=' + num + '&format=' + this.format + '&filter[]=callnumber-first:\"' + callnumtype +'\"';
		}
});

var BookChooseView = Backbone.View.extend({
	initialize: function(){
		var temp;
		var that = this;
		that.page = 1;
		this.formatIcons = {};
		this.callNumbertype = "";

		require(['text!bookChooseT.html'], function(t) {
			that.fullTemplate = t;
        	that.template = _.unescape($(t).find('.direct-import').html());
        	that.render();
    	});
	},
	el: '#_el',
	events: {
		'click #show-btn': 'clickListener',
		'click .item': 'bookClick',
		'click #prev-button': 'prevPage',
		'click #next-button': 'nextPage',
		'click #topic-button': 'dropdown',
		'click .chosen-drop': 'formatDisable'
	},
	render: function () {
		console.log("rendering " + bookChooseModel.location);
		this.page = 1;
		var temp;
			temp = _.template(this.template, {data:bookChooseModel});
		this.$el.html(temp);
		/*var data = {
			location:bookChooseModel.locationLabel
		};*/
		//$('#toptitle').html(bookChooseModel.locationLabel);
		//var temp = _.template(this.template, {});
		$('.pager').hide();
		$('#nothing').hide();
		var $select = $("#format-selector");
		//$select.append('<option value=""></option>');
		var formats = ["Any format", "Book", "Electronic", "Journal / Magazine", "Microform", "Music Score", "Music Recording", "Map", "Manuscript", "Film or Video", 
		"Sound Recording", "Software / Computer File", "Music Manuscript", "Textual Material", "Archive", "Archival Collection", 
		"2D Art", "Mixed Material", "Kit", "Manuscript Map", "3D Object"];
		var $selecttype = $("#type-selector");
		for(var i=0; i<formats.length; i++)
		{
			if(formats[i]=="Any format") 
				$select.append('<option value="">' + formats[i] + '</option>');
			else 
				$select.append('<option value="'+ formats[i] +'">' + formats[i] + '</option>');
		}
		$('.type-select').chosen({});

		///completed list
		this.formatIcons["Map"] = "01a";
		this.formatIcons["eMap"] = "01b";
		this.formatIcons["Film or Video"] = "02a";
		this.formatIcons["DVD"] = "02a";
		this.formatIcons["VHS"] = "02a";
		this.formatIcons["Blu-ray"] = "02a";
		this.formatIcons["Movie"] = "02a";
		this.formatIcons["Digital Video"] = "02b";
		this.formatIcons["Sound Recording"] = "03a";
		this.formatIcons["Spoken Word Recording"] ="03a";
		this.formatIcons["Audiocasette"] = "03a";
		this.formatIcons["Vinyl LP"] = "03a";
		this.formatIcons["Digital Audio"] = "03b";
		this.formatIcons["Music Recording"] = "04a";
		this.formatIcons["Audiocassette"] = "04a";
		this.formatIcons["Audio CD"] = "04a";
		this.formatIcons["MP3"] = "04b";
		this.formatIcons["2D Art"] = "05a";
		this.formatIcons["Chart"] = "05a";
		this.formatIcons["Graphic"] = "05a";
		this.formatIcons["Digital Art"] = "05b";
		this.formatIcons["Software / Computer File"] = "06a";
		this.formatIcons["Kit"] = "07a";
		this.formatIcons["Mixed Material"] = "08a";
		this.formatIcons["Archive"] = "08a";
		this.formatIcons["3D Object"] = "09a";
		this.formatIcons["Manuscript"] = "10a";
		this.formatIcons["Manuscript Map"] = "10a";
		this.formatIcons["Microform"] = "06a";
		this.formatIcons["Textual Material"] = "11a";
		this.formatIcons["eText"] = "11b";
		this.formatIcons["eBook"] = "11b";
		this.formatIcons["Book"] = "11a";
		this.formatIcons["Journal / Magazine"] = "12a";
		this.formatIcons["eJournal"] = "12b";
		this.formatIcons["Archival Collection"] = "13a";
		this.formatIcons["Music Score"] = "19a";
		
		if(this.query) {
        	var searchField = $("#search-field")[0];
			searchField.value = this.query;

			//setting the values of the selectors
			$("#type-selector").val(bookChooseModel.type).trigger('chosen:updated');
			$("#format-selector").val(this.format).trigger('chosen:updated');
		}
		$("#topic-button").text("+");
	},
	clickListener: function(obj) {
		$("#searchLoader").fadeIn("slow");
		this.query = $("#search-field").val();
		bookChooseModel.type = $("#type-selector").chosen().val();
		bookChooseModel.format = $("#format-selector").chosen().val();
		this.page = 1;
		document.getElementById("books-listing").innerHTML = "";

		//gets the call number type from the drop down menu
		this.callNumbertype = $("input:radio[name=classification]:checked").val();
		console.log("callNumbertype value: " + this.callNumbertype)
		if(this.callNumbertype == undefined )
		{
			this.callNumbertype = "";
			console.log("setting cnt to nothing " + this.callNumbertype);
		}
		
		this.page = 1;
 		if ($("#topic-button").text() == "-") { $("#topics").slideToggle("slow"); $("#topic-button").text("+"); }
		//console.log(type + " " + format);
		this.doQuery(this.query, bookChooseModel.type, bookChooseModel.format);
		console.log("loc/"+bookChooseModel.location+"/"+encodeURIComponent(this.query)+"+"+bookChooseModel.type+"+"+bookChooseModel.format+"+"+this.page);
		router.navigate("loc/"+bookChooseModel.location+"/"+encodeURIComponent(this.query)+"+"+bookChooseModel.type+"+"+bookChooseModel.format+"+"+"1", {trigger: false});
		return false;
	},
	prevPage: function(e) {
		console.log("prev page link was clicked");
		this.page--;
		this.doQuery();
		router.navigate("loc/"+bookChooseModel.location+"/"+encodeURIComponent(this.query)+"+"+bookChooseModel.type+"+"+bookChooseModel.format+"+"+this.page, {trigger: false});
		e.preventDefault();
	},
	nextPage: function(e) {
		console.log("next page link was clicked");
		this.page++;
		this.doQuery();
		router.navigate("loc/"+bookChooseModel.location+"/"+encodeURIComponent(this.query)+"+"+bookChooseModel.type+"+"+bookChooseModel.format+"+"+this.page, {trigger: false});
		e.preventDefault();
        //router.navigate("http://google.com", {trigger: false});

	},
	doQuery: function(q, type, format)
	{
		//console.log(model.attributes[0].title);
		bookChooseModel.changeParams(1, this.page, this.callNumbertype);
		var that = this;
		if(q) {
			this.query = q;
			bookChooseModel.type = type;
			bookChooseModel.format = format;
			console.log("the values have been set.");
		}
		var options = {
			data: {
				loc: bookChooseModel.location,
				query: that.query,
				type: bookChooseModel.type,
				page: that.page,
				format: bookChooseModel.format,
			},
			success: function(res) {
				$("#searchLoader").hide();
				var $select = $("#books-listing");
				$select.empty();
				//var bookT = _.unescape($(that.fullTemplate).find('.item')[0].outerHTML);
				$.each(function(res, item) {
					var data = {
						title: item.get("title"),
						bibId: item.get("bibId"),
						imgUrl: item.get("thumbnail"),
						author: item.get("author"),
						pubYear: item.get("pubYear"),
						location: item.get("location"),
						format: item.get("format"),
						formatUrl: that.formatIcons[item.get("format")]
					};
					var compiledT = _.template(bookT, {data:data});
					$select.append(compiledT);
				});
				console.log(res);
					var text = "";
					var i;
				console.log(Object.keys(res.attributes).length);
				var count = Object.keys(res.attributes).length - 2;
				if(Object.keys(res.attributes).length == 2)
				{
					$('#nothing').show();
				}
				else{
					$('#nothing').hide();
				for (i = 0; i < count; i++) {
						text += "<li class='item' value='"+ res.attributes[i].bibId +"' formatvalue='"+ res.attributes[i].format +"' style='cursor: pointer; !important'>";
						text += "<a data-toggle='tab' class=''>";
						text += "<img src='"+res.attributes[i].thumbnail+"' id='butts' style='position:relative; !important' alt='the image cannot be shown' class='thumbnail'/>";
						text += "<div class='item-descr'>";
						text += "<p><h5>"+res.attributes[i].title+"</h5></p>";
						text += "<p>Author: <b>"+res.attributes[i].author+"</b></p>";
						text += "<p>Publication Year: <b>"+res.attributes[i].pubYear+"</b></p>";
						text += "<p>Format: <b>"+res.attributes[i].format+"</b></p>";
						text += "</div>";
						text += "<img src='./assets/images/format_icons/"+that.formatIcons[res.attributes[i].format]+".png' alt='format icon' class='format-icon'/>";
						text += "</a>";
						text += "</li>";
					}
					document.getElementById("books-listing").innerHTML = text;
				}

				if(i>19) {
					$('.pager').show();
				} else {
					$('.pager').hide();
				}
				$(".thumbnail").each(function(index) {
					this.onload = function() {
						if(this.naturalWidth == 1 || this.naturalWidth == 0) {
							this.src = "./no_photo.jpg";
						}
					}
				});
			for (i=0; i < 22; i++) {
				delete res.attributes[i];
			}
			},
			error: function(e) {
				console.log("hmm, looks like there was some error");
			}
		};
		bookChooseModel.fetch(options);
		$("html, body").animate({ scrollTop: 0 }, "slow");
	},
	bookClick: function(obj) {
		router.navigate("loc/"+bookChooseModel.location+"/"+encodeURIComponent(this.query)+"/"+$(obj.target).closest(".item").attr("value")+"/"+$(obj.target).closest(".item").attr("formatvalue"), {trigger: true});
	},
	dropdown: function() {
   	 $("#topics").slideToggle();
   	 if ($("#topic-button").text() == "-") { $("#topic-button").text("+"); setTimeout(function (){

             $("input:radio").removeAttr("checked");

         }, 450) } else { $("#topic-button").text("-"); }
	 },
	formatDisable: function() {
		if ($("#type-selector").val() == "call_num")
			$("#format_selector_chosen").animate({
				width: 'hide'
			});
		else
			$("#format_selector_chosen").animate({
				width: 'show'
			});
		console.log($("#type-selector").val());
	}
});