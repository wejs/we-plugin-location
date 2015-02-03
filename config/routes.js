module.exports.routes = {
  'get /location/:countryCode': {
    controller    : 'LocationController',
    action        : 'findStatesByCountryCode',
    model         : 'state'
  },

  'get /location/:countryCode/:stateCode': {
    controller    : 'LocationController',
    action        : 'findCitiesByStateCode',
    model         : 'city'
  }
}