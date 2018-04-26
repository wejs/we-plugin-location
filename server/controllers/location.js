/**
 * Location controller
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
  findCountries(req, res) {
    const we = req.getWe();

    return we.db.models.lcountry.findAll(res.locals.query)
    .then((country)=> {
      if(!country) return res.notFound();

      // set http cache headers
      if (!res.getHeader('Cache-Control'))
        res.setHeader('Cache-Control', 'public, max-age='+we.config.cache.maxage);

      res.locals.data = country;
      return res.ok();
    })
    .catch(res.queryError);
  },

  // /location/:countryCode/:stateCode
  findCitiesByStateCode(req, res, next) {
    const we = req.getWe();

    //var countryCode = req.params.countryCode;
    let stateCode = req.params.stateCode;
    if (!stateCode) return next();

    return we.db.models.lstate.findOne( {
      where: { code: stateCode }
    })
    .then((state)=> {
      if(!state) return res.notFound();

      res.locals.query.where.stateId = state.id;
      res.locals.query.order = [['name', 'DESC']];

      return we.db.models.lcity.findAndCountAll(res.locals.query)
      .then((result)=> {

        res.locals.metadata.state = state;
        res.locals.metadata.count = result.count;
        res.locals.data = result.rows;

        return res.ok();
      });
    })
    .catch(res.queryError);
  },

  // /location/:countryCode
  findStatesByCountryCode(req, res, next) {
    const we = req.getWe();

    let countryCode = req.params.countryCode;
    if (!countryCode) return next();

    return we.db.models.lcountry.findOne({
      where: {code: countryCode}
    })
    .then((country)=> {
      if(!country) return res.notFound();

      res.locals.query.where.countryId = country.id;
      res.locals.query.order = [['code','DESC']];

      return we.db.models.lstate.findAndCountAll(res.locals.query)
      .then((result)=> {

        res.locals.metadata.country = country;
        res.locals.metadata.count = result.count;
        res.locals.data = result.rows;

        return res.ok();
      });
    })
    .catch(res.queryError);
  }
};
