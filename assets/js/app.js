var App = new Backbone.Marionette.Application();

// regions correspond to different areas of the application
App.addRegions({
	info: '#info'
});

$(document).ready(function() {
	App.start();
});