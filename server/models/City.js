/**
 * City
 *
 * @module      :: Model
 * @description :: City model
 *
 */

module.exports = {
  schema: true,
  attributes: {
    name: 'string',
    state: {
      model: 'state'
    },
    toJSON: function() {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;

      return obj;
    }
  }
}