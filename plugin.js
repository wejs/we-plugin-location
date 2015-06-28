/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);
  // set plugin configs
  // plugin.setConfigs();

  // set plugin routes
  plugin.setRoutes({
    'get /api/v1/location/:countryCode': {
      controller    : 'location',
      action        : 'findStatesByCountryCode',
      model         : 'lstate',
      responseType  : 'json'
    },
    'get /api/v1/location/:countryCode/:stateCode': {
      controller    : 'location',
      action        : 'findCitiesByStateCode',
      model         : 'lcity',
      responseType  : 'json'
    }
  });

  return plugin;
};