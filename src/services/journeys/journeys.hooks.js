const { populate } = require('feathers-hooks-common');
const addChildTransaction = require('../../hooks/add-child-transaction');

const materialLabelSchema = {
  include: {
    service: 'material',
    nameAs: 'itemPopulated',
    parentField: 'item',
    childField: '_id',
    query: {
      $select: ['label', 'images'],
    },
  },
};

const userLabelSchema = (parentField) => ({
  include: {
    service: 'users',
    nameAs: `${parentField}Populated`,
    parentField,
    childField: '_id',
    query: {
      $select: ['email', 'createdAt', 'brandingLabels', 'profilePicture'],
    },
  },
});

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [
      populate({ schema: materialLabelSchema }),
      populate({ schema: userLabelSchema('supplier') }),
      populate({ schema: userLabelSchema('customer') }),
    ],
    find: [],
    get: [addChildTransaction()],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
