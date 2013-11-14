var BikeDataManager = new Backbone.Marionette.Application();

//set up main region on the page
BikeDataManager.addRegions({
	mainRegion: '#mainContent'
});

//set the model - this is one bike ride's data
BikeDataManager.Bike = Backbone.Model.extend({
	defaults: {
		date: "",
		distance: "",
		time: "",
		avgSpeed: "",
		maxSpeed: "",
		avgCadence: "",
		location: ""
	}
});

//set the model's view. (the definition list)
BikeDataManager.BikeView = Backbone.Marionette.ItemView.extend({
	template: '#ride-template',
	tagName: 'dl'
});

//initialize the page.
BikeDataManager.addInitializer(function(){
	var bike = new BikeDataManager.Bike({
		"date": "5/14",
		"distance": "10.53",
		"time": "52:45",
		"avgSpeed": "11.98",
		"maxSpeed": "18.34",
		"avgCadence": "51",
		"location": ""
	});

	var bikeView = new BikeDataManager.BikeView({
		model: bike
	});

	//show the main region of the app
	BikeDataManager.mainRegion.show(bikeView);
});