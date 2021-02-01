// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
// check predefined questions
// if business criteria does not exist, add it
// add business criteria to transaction context data
module.exports = (options = {}) => async (context) => {
  const { data = {}, params = {}, app } = context;
  const { user = {} } = params;
  const { _id: userId = '600b1251562684ca4ed2a28c' } = user;

  const {
    filteredPredefinedQuestionValues = {},
    complianceCheckPoints = [],
  } = data;

  console.log('filteredPredefinedQuestionValues', filteredPredefinedQuestionValues);

  const filteredQuestionData = Object.entries(filteredPredefinedQuestionValues);

  if (!Object.keys(filteredQuestionData).length) {
    return context;
  }

  const businessCriteriaResponse = await Promise.allSettled(
    filteredQuestionData.map(
      ([criterionKey]) => app.service('business-criteria').get(criterionKey),
    ),
  );

  console.log('businessCriteriaResponse', businessCriteriaResponse);

  const tempData = businessCriteriaResponse.map(
    (criterion, index) => {
      const { status } = criterion;
      if (status === 'fulfilled') {
        return Promise.resolve(criterion);
      }
      const [criterionId, criterionData] = filteredQuestionData[index];
      const { information = {}, isSelfCertificationAllowed = true, selfCertificationComment = '' } = criterionData;
      const {
        acceptableAnswers = [],
        primaryQuestion,
        certifier,
        category,
      } = information;

      return app.service('business-criteria').create({
        baseAtomicCriterion: criterionId,
        user: userId,
        acceptableAnswers,
        primaryQuestion,
        validExternalCertifications: [certifier],
        category,
        isSelfCertificationEvidenceAllowed: {
          value: isSelfCertificationAllowed,
          comments: selfCertificationComment,
        },
      });
    },
  );

  // const newBusinessCriteriaPromises = businessCriteriaResponse.map(
  //   // (criterion, index) => {
  //   (criterion = {}) => {
  //     const { status } = criterion;
  //     return Promise.resolve(status);
  //     // if (status === 'fulfilled') {
  //     //   return Promise.resolve(criterion);
  //     // }
  //     // const [criterionId, criterionData] = filteredQuestionData[index];
  //     // const { information = {}, isSelfCertificationAllowed = true, selfCertificationComment = '' } = criterionData;
  //     // const {
  //     //   acceptableAnswers = [],
  //     //   primaryQuestion,
  //     //   certifier,
  //     //   category,
  //     // } = information;

  //     // return app.service('business-criteria').create({
  //     //   baseAtomicCriterion: criterionId,
  //     //   user: userId,
  //     //   acceptableAnswers,
  //     //   primaryQuestion,
  //     //   validExternalCertifications: [certifier],
  //     //   category,
  //     //   isSelfCertificationEvidenceAllowed: {
  //     //     value: isSelfCertificationAllowed,
  //     //     comments: selfCertificationComment,
  //     //   },
  //     // });
  //   },
  // );

  const newCreatedBusinessCriteria = await Promise.all(tempData);

  console.log('businessCriteriaResponse', businessCriteriaResponse);
  console.log('newCreatedBusinessCriteria', newCreatedBusinessCriteria);
  const updatedComplianceCheckPoints = [
    ...complianceCheckPoints,
    ...newCreatedBusinessCriteria
      .map(
        (registeredBusinessCriterion) => ({
          criterion: registeredBusinessCriterion._id,
        }),
      ),
  ];

  context.data.complianceCheckPoints = updatedComplianceCheckPoints;

  return context;
};
