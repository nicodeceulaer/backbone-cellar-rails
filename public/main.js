// code demo from a backbone intro tutorial by CHRISTOPHE COENRAETS
// http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-part-1-getting-started/
// http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-%E2%80%94-part-2-crud/
// http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-%E2%80%94-part-3-deep-linking-and-application-states/

window.Wine = Backbone.Model.extend({
	urlRoot: "api/wines",
	defaults: {
		"id": null,
	  "name":  "",
	  "grapes":  "",
	  "country":  "USA",
	  "region":  "California",
	  "year":  "",
	  "description":  "",
	  "picture":  "rails.png"
  }
});

window.WineCollection = Backbone.Collection.extend({
	model: Wine,
	url: "api/wines"
});

window.WineListView = Backbone.View.extend({

	el: $('#wineList'),

  initialize: function() {
		this.model.bind("reset", this.render, this);
		this.model.bind("add", function(wine) {
			$('#wineList').append(new WineListItemView({model: wine}).render().el);
	  });
  },

  render: function(eventName) {
	  _.each(this.model.models, function(wine) {
      $(this.el).append(new WineListItemView({model: wine}).render().el);
	  }, this);
	  return this;
  }
});

window.WineListItemView = Backbone.View.extend({

	tagName: "li",
	template: _.template($('#wine-list-item').html()),

  initialize: function() {
	  this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
  },

  render: function(eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
  },

	close: function() {
		$(this.el).unbind();
		$(this.el).remove();
	}
});

window.WineView = Backbone.View.extend({

  el: $('#mainArea'),
	template: _.template($('#wine-details').html()),

  initialize: function() {
		this.model.bind("change", this.render, this);
  },

  render: function(eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
  },

  events: {
    "change input"  : "change",
		"click .save"   : "saveWine",
		"click .delete" : "deleteWine"
  },

  change: function(event) {
    var target = event.target;
    console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
    
		// You could change your model on the spot, like this:
    // var change = {};
    // change[target.name] = target.value;
    // this.model.set(change);
  },

	saveWine: function() {
		this.model.set({
			name        : $('#name').val(),
			grapes      : $('#grapes').val(),
			country     : $('#country').val(),
			region      : $('#region').val(),
			year        : $('#year').val(),
			description : $('#description').val()
		});
		
    if (this.model.isNew()) {
  	  var self = this;
  	  // saving a new model
  	  app.wineList.create(this.model, {
  		  success: function() {
    		  // The second argument (false), indicates that we actually don't want to “execute” that route: we just want to change the URL.
  			  app.navigate('wines/'+self.model.id, false);
    		}
  	  });
    } else {
  	  this.model.save(); // updating a model
    }	
  	return false;
	},
	
	deleteWine: function() {
		this.model.destroy({
			success: function() {
				alert('Wine deleted successfully');
				window.history.back();
			}
		});
		return false;
	},

	close: function() {
		$(this.el).unbind();
		$(this.el).empty();
	}
});

window.HeaderView = Backbone.View.extend({

	el: $('.header'),
	template: _.template($('#header').html()),

  initialize: function() {
		this.render();
  },

  render: function(eventName) {
		$(this.el).html(this.template());
		return this;
  },

  events: {
		"click .new" : "newWine"
  },

  newWine: function(event) {
	  app.navigate("wines/new", true);
  	return false;
  }
});

var AppRouter = Backbone.Router.extend({

	routes: {
		""			    : "list",
		"wines/new"	: "newWine",
		"wines/:id"	: "wineDetails"
	},

	list: function() {
  	this.wineList = new WineCollection();
		var self = this;
		this.wineList.fetch({
			success: function() {
  			// creating a wineListView from a WineCollection instance
		    self.wineListView = new WineListView({model: self.wineList});
				self.wineListView.render();
				if (self.requestedId) self.wineDetails(self.requestedId);
			}
		});
  },

	wineDetails: function(id) {
		if (this.wineList) {
			this.wine = this.wineList.get(id);
			if (this.wineView) this.wineView.close();

      // create a new wineView to render the details
      this.wineView = new WineView({model: this.wine});
			this.wineView.render();
		} else {
			this.requestedId = id;
			this.list();
		}
  },

	newWine: function() {
		console.log('MyRouter newWine');
		if (app.wineView) app.wineView.close();
		
		// create a new wineView to render the form
		app.wineView = new WineView({model: new Wine()});
		app.wineView.render();
	}

});

var app = new AppRouter();
Backbone.history.start();
var header = new HeaderView();