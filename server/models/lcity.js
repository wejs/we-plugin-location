/**
 * City
 *
 * @module      :: Model
 * @description :: City model
 *
 */


module.exports = function Model(we) {
  // set sequelize model define and options
  var model = {
    definition: {
      name: { type: we.db.Sequelize.STRING }
    },

    associations: {
      state: {
        type: 'belongsTo',
        model: 'lstate'
      }
    },

    options: {
      classMethods: {},
      instanceMethods: {
        toJSON: function() {
          var obj = this.get();
          delete obj.createdAt;
          delete obj.updatedAt;
          delete obj.deletedAt;
          return obj;
        }
      },
      hooks: {}
    }
  }

  return model;
}