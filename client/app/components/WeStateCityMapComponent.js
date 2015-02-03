
App.WeStateCityMapComponent = Ember.Component.extend({
  country: 'BR',

  locationCity: null,
  locationState: null,

  apiKey: null,
  mapsImageApiUrl: 'https://www.google.com/maps/embed/v1/place?zoom=12',

  mapSrc: function() {
    if (!this.get('locationState')) {
      return null;
    }
    var location = '&q=' + this.get('country');

    location += ',' + this.get('locationState');

    if (this.get('locationCity')) {
      location += ',' + this.get('locationCity');
    }

    var url = this.get('mapsImageApiUrl') + location;

    //set optional api key
    if (this.get('apiKey')) {
      url += ('&key=' + this.get('apiKey') );
    }

    return url;
  }.property('locationState', 'locationCity'),

  init: function init() {
    this._super();

    if (!this.get('apiKey')) {
      if (we.configs.client.publicVars.googleMapsAPIKey) {
        this.set('apiKey', we.configs.client.publicVars.googleMapsAPIKey);
      }
    }
  }
});