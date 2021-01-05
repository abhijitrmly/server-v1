const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common');

const materialLabelSchema = {
  include: {
    service: 'material',
    nameAs: 'itemPopulated',
    parentField: 'item',
    childField: '_id',
    query: {
      $select: ['label', 'images'],
    },
  }
};

const userLabelSchema = parentField => ({
  include: {
    service: 'users',
    nameAs: `${parentField}Populated`,
    parentField: parentField,
    childField: '_id',
    query: {
      $select: ['email', 'createdAt'],
    },
  }
});

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: []
  },

  after: {
    all: [
      populate({ schema: materialLabelSchema }),
      populate({ schema: userLabelSchema('supplier') }),
      populate({ schema: userLabelSchema('customer') }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
