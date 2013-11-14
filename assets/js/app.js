var BikeDataManager = new Marionette.Application();

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

//set the collection with the Bike model
BikeDataManager.BikeCollection = Backbone.Collection.extend({
	model: BikeDataManager.Bike
});

//set the model's view. (the definition list)
BikeDataManager.BikeItemView = Marionette.ItemView.extend({
	template: '#ride-template',
	tagName: 'dl'
});

//set the collection's view.
BikeDataManager.BikesView = Marionette.CollectionView.extend({
	itemView: BikeDataManager.BikeItemView
});

//initialize the page.
BikeDataManager.addInitializer(function(){
	//set a collection of data.
	var bikes = new BikeDataManager.BikeCollection([
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
		}
	]);

	var bikesView = new BikeDataManager.BikesView({
		collection: bikes //pass a collection to the BikesView -- which is a collection view.
	});

	//show the main region of the app
	BikeDataManager.mainRegion.show(bikesView);
});