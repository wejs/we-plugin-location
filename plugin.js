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
    },
    'get /api/v1/location': {
      controller    : 'location',
      action        : 'findCountries',
      model         : 'lcountry',
      responseType  : 'json'
    },
  });

  plugin.setTemplates({
    'forms/location/country': __dirname + '/server/templates/forms/location/country.hbs',
    'forms/location/state': __dirname + '/server/templates/forms/location/state.hbs',
    'forms/location/city': __dirname + '/server/templates/forms/location/city.hbs'
  });

  // campos de cfp e passaporte
  plugin.hooks.on('we:models:before:instance', function (we, done) {

    we.db.modelsConfigs.user.definition.country = {
      type: we.db.Sequelize.STRING(5),
      formFieldType: 'location/country',
      defaultValue: 'BR'
    }

    we.db.modelsConfigs.user.definition.locationState = {
      type: we.db.Sequelize.STRING(10),
      formFieldType: 'location/state',
      formCountryFieldName: 'country'
    }
    we.db.modelsConfigs.user.definition.city = {
      type: we.db.Sequelize.STRING,
      formFieldType: 'location/city',
      formStateFieldName: 'locationState'
    }
    we.db.modelsConfigs.user.definition.afterLocation = {
      type: we.db.Sequelize.VIRTUAL,
      formFieldType: 'break'
    }

    done();
  });


  plugin.events.on('we:after:load:forms', function (we) {
    if (we.form.forms.register.fields.beforeLocation !== null)
      we.form.forms.register.fields.beforeLocation = {
        type: 'break'
      }
    // extend core register form
    if (we.form.forms.register.fields.country !== null)
      we.form.forms.register.fields.country = {
        type: 'location/country',
        defaultValue: 'BR'
      }

    if (we.form.forms.register.fields.locationState !== null)
      we.form.forms.register.fields.locationState = {
        type: 'location/state',
        formCountryFieldName: 'country'
      }

    if (we.form.forms.register.fields.city !== null)
      we.form.forms.register.fields.city = {
        type: 'location/city',
        formStateFieldName: 'locationState'
      }

    if (we.form.forms.register.fields.afterLocation !== null)
      we.form.forms.register.fields.afterLocation = {
        type: 'break'
      }
   });

  return plugin;
};