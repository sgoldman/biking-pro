var BikeDataManager = new Marionette.Application();

//set up main region on the page
BikeDataManager.addRegions({
	mainRegion: '#mainContent'
});

//set the model - this is one bike ride's data
BikeDataManager.Bike = Backbone.Model.extend({
	defaults: {
		id: "",
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

//set up page layouts. --- extends from ItemView.
BikeDataManager.layout = Marionette.Layout.extend({
	template: "#bike-layout",

	regions: {
		form: '#newBikeData',
		graph: '#graph',
		info: '#infoContainer'
	},

	events: {
		'click #addData' : 'addBike'
	},

	addBike: function(e) {
		e.preventDefault();

		var formData = {};
		
		$('#addBikeInfo').find('input').each(function(i, el) {

			//iterate all of the input elements and set the formData if not empty			
			if( $(el).val() !== "" ) {
				formData[el.id] = $(el).val();
			}
		});

		if ( !jQuery.isEmptyObject(formData) ) {

			//add a unique id to grab the detail view later.
			formData['id'] = BikeDataManager.collectionLength;

			//add it to the local data
			BikeDataManager.bikeData.push(formData);

			console.log(BikeDataManager.bikeData)
			//add the new data to the collection, instantiating a new model.
			BikeDataManager.bikesCollection.add(new BikeDataManager.Bike(formData));

			BikeDataManager.collectionLength++;
		}

	}
});

//set the model's view. (the definition list)
BikeDataManager.BikeItemView = Marionette.ItemView.extend({
	template: '#ride-template',
	className: 'ride-wrap'
});

// List of Bike Dates View
BikeDataManager.BikeListView = Marionette.ItemView.extend({
	template: '#single-line-template',
	tagName: 'ul',

	events: {
		'click .specific-ride' : 'showRideInfo'
	},

	showRideInfo: function(e) {
		e.preventDefault();
		var id = $(e.currentTarget).data('id'),
			item = BikeDataManager.bikesCollection.get(id),

			bikeView = new BikeDataManager.BikeItemView({
				model: item //pass a collection to the BikesView -- which is a collection view.
			});

		BikeDataManager.bikeLayout.info.show(bikeView);
		
	}
});

//set the collection's view.
BikeDataManager.BikesView = Marionette.CompositeView.extend({
	className: 'rides-wrap',
	template: '#rides-template',
	itemView: BikeDataManager.BikeItemView,

	//where to append the html
	itemViewContainer: '.ride-info'
});

//set the bike dates view
BikeDataManager.BikesListView = Marionette.CompositeView.extend({
	template: '#single-line-wrap-template',
	itemView: BikeDataManager.BikeListView,

	itemViewContainer: '#ridesListWrap'
});

//initialize the page.
BikeDataManager.addInitializer(function(){
	//init the layout
	BikeDataManager.bikeLayout = new BikeDataManager.layout();
	BikeDataManager.bikeLayout.render();

	//fetch the data
	$.ajax({
		url: 'assets/data/bikeData.json'
	}).done(function(data) {
		BikeDataManager.bikeData = data.bikeData;
		console.log(data.bikeData)
		//trigger that the data has been fetched
		BikeDataManager.vent.trigger('data:fetched');

	});

});

//show the views when the ajax call is finished!
BikeDataManager.vent.on('data:fetched', function() {
	
	//full data view.
	// BikeDataManager.bikesCollection = new BikeDataManager.BikeCollection(BikeDataManager.bikeData);
	// var bikesView = new BikeDataManager.BikesView({
	// 	collection: BikeDataManager.bikesCollection //pass a collection to the BikesView -- which is a collection view.
	// });

	BikeDataManager.bikesCollection = new BikeDataManager.BikeCollection(BikeDataManager.bikeData);
	BikeDataManager.collectionLength = BikeDataManager.bikesCollection.length;

	console.log(BikeDataManager.bikesCollection)
	var bikesListView = new BikeDataManager.BikesListView({
		collection: BikeDataManager.bikesCollection //pass a collection to the BikesView -- which is a collection view.
	});
	console.log(BikeDataManager.bikesCollection)
	//show the main region of the app
	BikeDataManager.mainRegion.show(BikeDataManager.bikeLayout);

	//show the data
	// BikeDataManager.bikeLayout.info.show(bikesListView);

	BikeDataManager.bikeLayout.graph.show(bikesListView);
});