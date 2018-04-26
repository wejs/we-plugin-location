/**
 * We.js command to import all locations
 */

const path = require('path');
let we;

module.exports = function Command (program, helpers) {
  program
  .command('register-all-locations')
  .alias('RAL')
  .description('Comando para cadastrar todas as localizações disponíveis no we-plugin-location')
  .action( function run() {
    we = helpers.getWe();

    we.bootstrap( (err)=> {
      if (err) return doneAll(err);
      let p = path.resolve(__dirname,'..', 'bin/registerAllLocations.js');
      const rl = require(p);
      rl.saveLocations(we, doneAll);
    });
  });
}

function doneAll(err) {
  if (err) {
    console.error('RAL:Done with error', err);
  } else {
    console.log('RAL:Done all');
  }

  we.exit(process.exit);
}