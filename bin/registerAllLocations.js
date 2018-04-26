/**
 * Script to load all locations in app DB
 *
 * Require it in a App script
 */

// TODO add suport to load others locations from .json
const locations = require('../lib/locations/BR.json'),
  countries = require('../lib/locations/countries.json');

let CLI = {};

CLI.saveLocations = function saveLocations(we, done) {
  let cityCount = 0,
    stateCount = 0,
    async = we.utils.async;

  console.time('Full import time:');

  return we.db.models.lcountry.bulkCreate(countries)
  .spread( ()=> {
    async.eachSeries(countries, (cData, cNext)=> {
      importOneCountry(cData, cNext);
    }, done);
    return null;
  })
  .catch(done);

  function importOneCountry(cData, done) {
    if (cData.code != 'BR') return done(); // only have BR states
    return we.db.models.lcountry
    .findOne({ where: { code: cData.code } })
    .then((country)=> {
      we.log.info('registerAllLocations:Country imported:id'+country.id+':'+ country.code);

      async.eachSeries(locations.states, (state, nextState)=> {
        importOneState(state, country, nextState);
      }, function afterCreateStates(err) {
        if (err) {
          we.log.error('Error on create states', err);
        }

        console.log('DONE created '+ stateCount + ' states and ' + cityCount + ' cities');
        console.timeEnd('Full import time:');

        return done();
      });

      return null;
    });
  }

  function importOneState(state, country, nextState) {
    console.time('State:'+state.code+':importTime:');

    return we.db.models.lstate.create({
      code: state.code,
      name: state.name,
      countryId: country.id
    })
    .then( (salvedState)=> {
      console.log('registerAllLocations:State imported:id:'+
          salvedState.name+':code:'+country.code+'/'+salvedState.code);


      const cData = state.cities.map( (c)=> {
        return {
          name: c,
          stateId: salvedState.id
        }
      });

      we.db.models.lcity
      .bulkCreate(cData)
      .spread( ()=> {
        stateCount++;

        cityCount = cityCount+cData.length;

        console.timeEnd('State:'+state.code+':importTime:');

        // console.log('registerAllLocations:Cities created:'+state.cities.join(','));
        nextState();
        return null;
      });

      return null;
    })
    .catch(nextState);
  }
}

module.exports = CLI;
