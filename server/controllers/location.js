/**
 * Location controller
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
   // /location/:countryCode/:stateCode
  findCitiesByStateCode: function(req, res, next) {
    var we = req.getWe();

    //var countryCode = req.params.countryCode;
    var stateCode = req.params.stateCode;
    if (!stateCode) return next();

    return we.db.models.lstate.findOne( {
      where: { code: stateCode }
    }).then(function (state) {
      if(!state) return res.notFound();

      res.locals.query.where.stateId = state.id;
      res.locals.query.order = 'name DESC';

      return we.db.models.lcity.findAndCountAll(res.locals.query)
      .then(function (result) {

        res.locals.metadata.state = state;
        res.locals.metadata.count = result.count;
        res.locals.record = result.rows;

        return res.ok();
      }).catch(res.queryError);
    }).catch(res.queryError);
  },

  // /location/:countryCode
  findStatesByCountryCode: function(req, res, next) {
    var we = req.getWe();

    var countryCode = req.params.countryCode;
    if (!countryCode) return next();

    return we.db.models.lcountry.findOne({
      where: {code: countryCode}
    }).then(function (country) {
      if(!country) return res.notFound();

      res.locals.query.where.countryId = country.id;
      res.locals.query.order = 'code DESC';

      return we.db.models.lstate.findAndCountAll(res.locals.query)
      .then(function (result) {

        res.locals.metadata.country = country;
        res.locals.metadata.count = result.count;
        res.locals.record = result.rows;

        return res.ok();

      }).catch(res.queryError);
    }).catch(res.queryError);
  }
};
