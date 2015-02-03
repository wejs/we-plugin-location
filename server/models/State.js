/**
 * State
 *
 * @module      :: Model
 * @description :: State model
 *
 */

module.exports = {
  schema: true,
  attributes: {
    name: 'string',
    code: 'string',
    country: {
      model: 'country',
      via: 'states'
    },
    cities: {
      collection: 'city',
      via: 'state'
    },

    toJSON: function() {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;

      return obj;
    }
  }
}