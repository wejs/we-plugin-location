/**
 * LocationController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

// we.js controller utils
var actionUtil = require('we-helpers').actionUtil;

module.exports = {
  _config: {
    rest: false
  },

  // /location/:countryCode/:stateCode
  findCitiesByStateCode: function(req, res, next) {
    //var countryCode = req.param('countryCode');
    var stateCode = req.param('stateCode');
    if (!stateCode) return next();

    return State.findOne({code: stateCode}).exec(function(err, state) {
      if(err) {
        sails.log.error('findCitiesByStateCode:Error on find state', err);
        return res.serverError(err);
      }
      if(!state) return res.notFound();

      return City.find({state: state.id})
      .sort('name DESC')
      .exec(function(err, cities) {
        if (err) {
          sails.log.error('findCitiesByStateCode:Error on find States',err);
          return res.serverError(err);
        }
        return res.ok(cities);
      })
    });
  },

  // /location/:countryCode
  findStatesByCountryCode: function(req, res, next) {
    var sails = req._sails;
    var Country = sails.models.country;
    var State = sails.models.state;

    var countryCode = req.param('countryCode');
    if (!countryCode) return next();
    return Country.findOne({code: countryCode}).exec(function(err, country) {
      if(err) {
        sails.log.error('findStatesByCountryCode:Error on find Country', err);
        return res.serverError(err);
      }
      if(!country) return res.notFound();

      return State.find({country: country.id})
      .sort('code DESC')
      .exec(function(err, states) {
        if (err) {
          sails.log.error('findStatesByCountryCode:Error on find States',err);
          return res.serverError(err);
        }
        return res.ok(states);
      })
    })

  }
};
