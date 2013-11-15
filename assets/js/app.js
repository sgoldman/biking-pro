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
		console.log($('#addBikeInfo').find('input'))
		$('#addBikeInfo').find('input').each(function(i, el) {

			//iterate all of the input elements and set the formData if not empty			
			if( $(el).val() !== "" ) {
				formData[el.id] = $(el).val();
			}
		});

		console.log(formData)
		if ( !jQuery.isEmptyObject(formData) ) {
			BikeDataManager.bikeData.push(formData);

			console.log(BikeDataManager.bikeData)

			BikeDataManager.bikesCollection.add(new BikeDataManager.Bike(formData));
		}

	}
});

//set the model's view. (the definition list)
BikeDataManager.BikeItemView = Marionette.ItemView.extend({
	template: '#ride-template',
	tagName: 'dl'
});

//set the collection's view.
BikeDataManager.BikesView = Marionette.CompositeView.extend({
	className: 'rides-wrap',
	template: '#rides-template',
	itemView: BikeDataManager.BikeItemView,

	//where to append the html
	itemViewContainer: '.ride-info'
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

		//trigger that the data has been fetched
		BikeDataManager.vent.trigger('data:fetched');

	});

});

//show the views when the ajax call is finished!
BikeDataManager.vent.on('data:fetched', function() {
	
	BikeDataManager.bikesCollection = new BikeDataManager.BikeCollection(BikeDataManager.bikeData);
	var bikesView = new BikeDataManager.BikesView({
		collection: BikeDataManager.bikesCollection //pass a collection to the BikesView -- which is a collection view.
	});

	//show the main region of the app
	BikeDataManager.mainRegion.show(BikeDataManager.bikeLayout);

	//show the data
	BikeDataManager.bikeLayout.info.show(bikesView);
});