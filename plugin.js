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

  plugin.setTemplates({
    'forms/location/country': __dirname + '/server/templates/forms/location/country.hbs',
    'forms/location/state': __dirname + '/server/templates/forms/location/state.hbs',
    'forms/location/city': __dirname + '/server/templates/forms/location/city.hbs'
  });

  plugin.events.on('we:after:load:forms', function (we) {
    we.form.forms.register.fields.beforeLocation = {
      type: 'break'
    }
    // extend core register form
    we.form.forms.register.fields.country = {
      type: 'location/country',
      defaultValue: 'BR'
    }
    we.form.forms.register.fields.locationState = {
      type: 'location/state',
      formCountryFieldName: 'country'
    }
    we.form.forms.register.fields.city = {
      type: 'location/city',
      formStateFieldName: 'locationState'
    }
    we.form.forms.register.fields.afterLocation = {
      type: 'break'
    }
   });

  return plugin;
};