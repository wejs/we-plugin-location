/**
 * Country
 *
 * @module      :: Model
 * @description :: Country model
 *
 */

module.exports = function Model(we) {
  // set sequelize model define and options
  const model = {
    definition: {
      name: { type: we.db.Sequelize.STRING },
      code: { type: we.db.Sequelize.STRING(5) }
    },

    associations: {},

    options: {
      classMethods: {},
      instanceMethods: {
        toJSON() {
          let obj = this.get();
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