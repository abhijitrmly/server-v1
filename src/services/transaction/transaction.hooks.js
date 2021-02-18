/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  populate, keep, fastJoin, makeCallingParams, discardQuery,
} = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');
const bulkPopulateFields = require('../../hooks/bulk-populate-fields');

const { getResultsByKey, getUniqueKeys } = BatchLoader;

const postResolvers = ({
  targetService, parentArrayLabel, elementFieldLabel, newFieldLabel,
}) => ({
  before: (context) => {
    context._loaders = { businessCriterion: {} };

    context._loaders.businessCriterion.id = new BatchLoader(
      async (keys, batchLoaderContext) => {
        const result = await context.app.service(targetService).find(
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
    // eslint-disable-next-line consistent-return
    compliance_criteria: () => async (transaction, context) => {
      if (!transaction[parentArrayLabel]) return null;
      const businessCriteria = await context._loaders.businessCriterion.id.loadMany(
        transaction[parentArrayLabel].map((compliance) => compliance[elementFieldLabel]),
      );
      transaction[parentArrayLabel].forEach((compliance, i) => {
        compliance[newFieldLabel] = businessCriteria[i];
      });
    },
  },
});

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

const processBusinessComplianceData = require('../../hooks/process-business-compliance-data');

const patchComplianceValidationData = require('../../hooks/patch-compliance-validation-data');

const addUserFromEmail = require('../../hooks/add-user-from-email');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      createCriteriaFromCustomRequest(),
      addPredefinedCriteriaToTransaction(),
      addUserFromEmail(),
      keep('complianceCheckPoints', 'customer', 'supplier'),
    ],
    update: [authenticate('jwt')],
    patch: [
      authenticate('jwt'),
      processBusinessComplianceData(),
      patchComplianceValidationData(),
      discardQuery('outgoingComplianceValidationData', 'outgoingComplianceData'),
    ],
    remove: [],
  },

  after: {
    all: [
      populate({ schema: materialLabelSchema }),
      populate({ schema: userLabelSchema('supplier') }),
      populate({ schema: userLabelSchema('customer') }),
      fastJoin(postResolvers({
        targetService: 'business-criteria',
        parentArrayLabel: 'complianceCheckPoints',
        elementFieldLabel: 'criterion',
        newFieldLabel: 'businessCriterionDetails',
      })),
      bulkPopulateFields({
        complianceCheckPoints: {
          complianceData: {
            service: 'business-compliances',
            select: ['providedExternalCertifications', 'providedAnswers', 'providedEvidence', 'complianceValidation'],
            key: 'businessComplianceDetails',
          },
        },
      }),
      // fastJoin(postResolvers({
      //   targetService: 'business-compliances',
      //   parentArrayLabel: 'complianceCheckPoints',
      //   elementFieldLabel: 'complianceData',
      //   newFieldLabel: 'businessComplianceDetails',
      // })),
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
