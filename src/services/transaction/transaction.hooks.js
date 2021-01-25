/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  populate, keep, fastJoin, makeCallingParams,
} = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');

const { getResultsByKey, getUniqueKeys } = BatchLoader;

const postResolvers = {
  before: (context) => {
    context._loaders = { businessCriterion: {} };

    context._loaders.businessCriterion.id = new BatchLoader(
      async (keys, batchLoaderContext) => {
        const result = await context.app.service('business-criteria').find(
          makeCallingParams(
            batchLoaderContext,
            { _id: { $in: getUniqueKeys(keys) } },
            undefined,
            { paginate: false },
          ),
        );
        return getResultsByKey(keys, result, (businessCriterion) => businessCriterion._id, '!');
      },
      { context },
    );
  },

  joins: {
    compliance_criteria: () => async (transaction, context) => {
      if (!transaction.complianceCheckPoints) return null;
      const businessCriteria = await context._loaders.businessCriterion.id.loadMany(
        transaction.complianceCheckPoints.map((compliance) => compliance.criterion),
      );
      transaction.complianceCheckPoints.forEach((compliance, i) => {
        compliance.businessCriterionDetails = businessCriteria[i];
      });
    },
  },
};

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
      $select: ['email', 'createdAt'],
    },
  },
});

const createCriteriaFromCustomRequest = require('../../hooks/create-criteria-from-custom-request');

const addPredefinedCriteriaToTransaction = require('../../hooks/add-predefined-criteria-to-transaction');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // authenticate('jwt'),
      createCriteriaFromCustomRequest(),
      addPredefinedCriteriaToTransaction(),
      keep('complianceCheckPoints', 'customer'),
    ],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [],
  },

  after: {
    all: [
      populate({ schema: materialLabelSchema }),
      populate({ schema: userLabelSchema('supplier') }),
      populate({ schema: userLabelSchema('customer') }),
      fastJoin(postResolvers),
    ],
    find: [],
    get: [],
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
