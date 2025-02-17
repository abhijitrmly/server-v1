const registerBusinessCompliances = require('./register-business-compliances');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const {
    data = {}, params = {}, app, id,
  } = context;
  const { user = {} } = params;
  const { _id: userId } = user;

  const transactionData = await app.service('transaction').get(id);

  const { complianceCheckPoints = [] } = transactionData;
  const { outgoingComplianceData = {} } = data;

  if (Object.keys(outgoingComplianceData).length === 0) {
    delete context.data.complianceCheckPoints;
    return context;
  }

  const transactionObject = complianceCheckPoints.reduce((acc, curr) => ({
    ...acc,
    [curr._id]: { ...curr.businessCriterionDetails },
    criterion: curr.criterion,
  }), {});
  // check if compliance exists for this value already

  const promiseMap = Object.entries(outgoingComplianceData).map(
    ([complianceId, complianceValues]) => {
      const paramTransactionValue = transactionObject[complianceId];

      return ({
        complianceValues,
        paramTransactionValue,
        user: user._id,
      });
    },
  );

  // if yes, add this in transaction
  const complianceRegistrationResult = await Promise.all(promiseMap.map(
    (promiseData) => app.service('business-compliances').create(registerBusinessCompliances(promiseData)),
  ));

  console.log('complianceRegistrationResult', complianceRegistrationResult);

  context.data = {
    complianceCheckPoints: complianceRegistrationResult.map(
      (registrationData, index) => ({
        _id: Object.keys(outgoingComplianceData)[index],
        criterion: registrationData.linkedBusinessCriteria[0],
        complianceData: registrationData._id,
      }),
    ),
  };

  console.log('context.data', context.data);
  // if not, create business compliance and then add it in transaction

  return context;
};
