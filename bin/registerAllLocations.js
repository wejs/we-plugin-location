/**
 * Script to load all locations in app DB
 *
 * Require it in a App script with sails loaded
 */


// TODO add suport to load others locations from .json
var locations = require('../lib/locations/BR.json');
var async = require('async');

var CLI = {};

CLI.saveLocations = function saveLocations(done) {
  var states = [];
  var cities = [];

  return Country.create({
    name: 'Brasil',
    code: 'BR',
  }).exec(function(err, country) {
    if (err) {
      return done(err);
    }

    return async.each(locations.states, function(state, nextState) {
      return State.create({
        code: state.code,
        name: state.name,
        country: country.id
      }).exec(function(err, salvedState) {
        if(err) return nextState(err);
        return async.each(state.cities, function(city, nextCity) {
          return City.create({
            name: city,
            state: salvedState.id
          }).exec(function(err, cities){
            if (err) {
              return nextCity(err)
            }
            return nextCity();
          });
        }, function afterCreatedAllCities(err){
          if(err) {
            sails.log.error('Error on create cities',err);
            return done(err);
          }
          return nextState();
        });

      })

    },function afterCreateStates(err) {
      if (err) {
        sails.log.error('Error on create states', err);
      }

      return done();
    });
  })
}

module.exports = CLI;
