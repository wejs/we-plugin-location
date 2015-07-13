/**
 * Script to load all locations in app DB
 *
 * Require it in a App script
 */

// TODO add suport to load others locations from .json
var locations = require('../lib/locations/BR.json');
var countries = require('../lib/locations/countries.json');
var async = require('async');

var CLI = {};

CLI.saveLocations = function saveLocations(we, done) {
  var cityCount = 0;
  var stateCount = 0;
  console.time('State and city creation time:');

  return we.db.models.lcountry.bulkCreate(countries).then(function (country) {

    we.db.models.lcountry.findOne({where: { code: 'BR' } }).then(function(country) {
      return async.each(locations.states, function(state, nextState) {
        return we.db.models.lstate.create({
          code: state.code,
          name: state.name,
          countryId: country.id
        }).then(function (salvedState) {
          return async.each(state.cities, function (city, nextCity) {
            return we.db.models.lcity.create({
              name: city,
              stateId: salvedState.id
            }).then(function () {
              cityCount++;
               return nextCity();
            }).catch(nextCity);
          }, function afterCreatedAllCities (err) {
            if (err) {
              we.log.error('Error on create cities',err);
              return done(err);
            }

            stateCount++;
            return nextState();
          });

        }).catch(nextState);
      },function afterCreateStates(err) {
        if (err) {
          we.log.error('Error on create states', err);
        }

        we.log.info('DONE created '+ stateCount + ' states and ' + cityCount + ' cities');
        console.timeEnd('State and city creation time:');

        return done();
      })
    }).catch(done);
  }).catch(done);
}

module.exports = CLI;
