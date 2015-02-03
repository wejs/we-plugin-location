
App.WeStateCitySelectorComponent = Ember.Component.extend({
  country: 'BR',

  selectedState: '',
  selectedCity: '',

  selectedStateObject: null,
  selectedCityObject: null,

  oldSelectedState: null,
  oldSelectedCity: null,

  statesOptions: null,
  citiesOptions: null,

  stateAttribute: null,
  cityAttribute: null,

  // save event
  onSave: 'save',

  citySelectIsDisabled: function() {
    if ( this.get('selectedState') ) {
      return false;
    } else {
      return true;
    }
  }.property('selectedState'),

  onSelecState: function() {
    this.set('selectedCity', null);
    this.loadCities();
  }.observes('selectedState'),

  isLoading: false,

  hasChanges: function() {
    if (this.get('oldSelectedCity') !== this.get('selectedCity')) {
      return true;
    }
    if(this.get('oldSelectedState') !== this.get('selectedState')){
      return true;
    }

    return false;
  }.property('selectedState', 'selectedCity', 'oldSelectedState', 'oldSelectedCity'),

  // MAP
  showMap: true,
  apiKey: null,
  mapsImageApiUrl: 'https://www.google.com/maps/embed/v1/place?zoom=12',
  mapSrc: function() {
    if (!this.get('showMap') || !this.get('selectedState')) {
      return null;
    }
    var location = '&q=' + this.get('country');

    location += ',' + this.get('selectedState');

    if (this.get('selectedCity')) {
      location += ',' + this.get('selectedCity');
    }

    var url = this.get('mapsImageApiUrl') + location;

    //set optional api key
    if (this.get('apiKey')) {
      url += ('&key=' + this.get('apiKey') );
    }

    return url;
  }.property('selectedState', 'selectedCity'),

  init: function init() {
    this._super();
    var self = this;

    if (!this.get('apiKey')) {
      if (we.configs.client.publicVars.googleMapsAPIKey) {
        this.set('apiKey', we.configs.client.publicVars.googleMapsAPIKey);
      }
    }

    this.set('selectedCityObject', {
      name: this.get('selectedCity')
    });

    this.setCacheValues();

    // skip if has states set in state=stateArray
    if (this.get('statesOptions')) {
      return ;
    }

    if (!this.get('country')){
      throw new Error('Country is required in WeStateCitySelectorComponent') ;
    }

    this.set('isLoading', true);

    // wait 2 secconds to preload states data
    Ember.run.later(function(){
      return self.loadStates();
    }, 2000);
  },

  actions: {
    save: function() {
      if (this.get('onSave')) {
        // save city
        this.sendAction('onSave', this.get('selectedState'), this.get('selectedCity'));

        this.setCacheValues();
      } else {
        return true;
      }
    },
    reset: function() {
      this.set('selectedState', this.get('oldSelectedState'));
      this.set('selectedCity', this.get('oldSelectedCity'));
    }
  },

  setCacheValues: function () {
    this.set('oldSelectedState', this.get('selectedState'));
    this.set('oldSelectedCity', this.get('selectedCity'));
  },

  loadStates: function () {
    var self = this;
    var country = this.get('country');

    var url = '/location/' + country + '/';

    $.ajax({
      type: 'GET',
      url: url,
      cache: true,
      dataType: 'json' //Expected data format from server
    })
    .done(function(resp){
      self.set('statesOptions', resp.state);

      if (self.get('selectedState')) {
        var selectedState = self.get('selectedState');

        for (var i = resp.state.length - 1; i >= 0; i--) {
          if (resp.state[i].code == selectedState ) {
            self.set('selectedStateObject', resp.state[i]);
            self.loadCities();
            return;
          }
        }
      }
    })
    .fail(function( jqXHR, textStatus, errorThrown){
      Ember.Logger.error('Error on get states from server',url,textStatus, errorThrown);
    })
    .always(function() {
      self.set('isLoading', false);
    });
  },

  loadCities: function () {
    var self = this;
    var country = this.get('country');
    var stateCode = this.get('selectedState');

    if (!stateCode) {
      this.set('citiesOptions', null);
      return;
    }

    var url = '/location/' + country + '/' + stateCode;

    $.ajax({
      type: 'GET',
      url: url,
      cache: true,
      dataType: 'json' //Expected data format from server
    })
    .done(function(resp){
      self.set('citiesOptions', resp.city);
      if (self.get('selectedCity')) {
        var selectedCity = self.get('selectedCity');
        for (var i = resp.city.length - 1; i >= 0; i--) {
          if (resp.city[i].name == selectedCity ) {
            self.set('selectedCityObject', resp.city[i]);
            return;
          }
        }
      }
    })
    .fail(function( jqXHR, textStatus, errorThrown){
      Ember.Logger.error('Error on get states from server',url,textStatus, errorThrown);
    })
    .always(function() {
      self.set('isLoading', false);
    });
  }
})
