/**
 * Country
 *
 * @module      :: Model
 * @description :: Country model
 *
 */

module.exports = {
  schema: true,
  attributes: {
    name: 'string',
    code: 'string',
    states: {
      collection: 'state',
      via: 'country'
    },
    toJSON: function() {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;

      return obj;
    }
  },
}