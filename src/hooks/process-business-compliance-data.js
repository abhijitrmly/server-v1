const registerBusinessCompliances = require('./register-business-compliances');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const {
    data = {}, params = {}, app, id,
  } = context;
  const { user = {} } = params;
  const { _id: userId = '600b1251562684ca4ed2a28c' } = user;

  const transactionData = await app.service('transaction').get(id);

  const { complianceCheckPoints = [] } = transactionData;

  const transactionObject = complianceCheckPoints.reduce((acc, curr) => ({
    ...acc,
    [curr._id]: { ...curr.businessCriterionDetails },
    criterion: curr.criterion,
  }), {});
  // check if compliance exists for this value already

  const promiseMap = Object.entries(data).map(
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
        _id: Object.keys(data)[index],
        criterion: registrationData.linkedBusinessCriteria[0],
        complianceData: registrationData._id,
      }),
    ),
  };
  // if not, create business compliance and then add it in transaction

  return context;
};
