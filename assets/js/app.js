var BikeDataManager = new Backbone.Marionette.Application();

// regions correspond to different areas of the application
BikeDataManager.addRegions({
	mainRegion: '#info'
});

 Bike = Backbone.Model.extend({
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

 Bikes = Backbone.Collection.extend({
	model: Bike
});

 BikeView = Backbone.Marionette.ItemView.extend({
	template: '#ride-template',
	tagName: 'dl' 
});

BikeListView = Backbone.Marionette.CompositeView.extend({
	template: '#rides-template',
	itemView: BikeView,

	itemViewContainer: '.ride-info'
});

BikeDataManager.addInitializer(function(options) {
	var bikeListView = new BikeListView({
		collection: options
	});

	BikeDataManager.mainRegion.show(bikeListView);
});

$(document).ready(function() {
	var options = [
			{
				"date": "5/14",
				"distance": "10.53",
				"time": "52:45",
				"avgSpeed": "11.98",
				"maxSpeed": "18.34",
				"avgCadence": "51",
				"location": ""
			},
			{
				"date": "5/25",
				"distance": "29.29",
				"time": "2:29:54",
				"avgSpeed": "11.72",
				"maxSpeed": "24.25",
				"avgCadence": "55",
				"location": "Riley's Lock"			
			}];

	var bikes = new Bikes(options);
	BikeDataManager.start(bikes);
});