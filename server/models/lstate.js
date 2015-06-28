/**
 * State
 *
 * @module      :: Model
 * @description :: State model
 *
 */

module.exports = function Model(we) {
  // set sequelize model define and options
  var model = {
    definition: {
      name: { type: we.db.Sequelize.STRING },
      code: { type: we.db.Sequelize.STRING(5) }
    },

    associations: {
      country: {
        type: 'belongsTo',
        model: 'lcountry'
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

