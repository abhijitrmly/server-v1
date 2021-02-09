// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// this hook does the following-
// 1. create atomic criteria from custom questions
// 2. create business criteria from atomic criteria

module.exports = () => async (context) => {
  const { data = {}, params = {}, app } = context;
  const { user = {} } = params;
  const { _id: userId } = user;
  const {
    filteredcustomCriteriaValues = {},
    customer = userId,
    complianceCheckPoints = [],
  } = data;

  console.log('data', data);

  // @TODO move this to a separate hook
  context.data.customer = customer;

  if (!Object.keys(filteredcustomCriteriaValues).length) {
    return context;
  }

  const atomicCriteriaArray = Object.entries(filteredcustomCriteriaValues)
    .map(([, criterionData]) => {
      console.log('criterionData', criterionData);
      const {
        primaryQuestion,
        category,
        correctAnswer = {},
        questionType,
      } = criterionData;

      const {
        label,
        minValueNumber,
        maxValueNumber,
        valueBoolean = false,
      } = correctAnswer;

      const acceptableAnswer = questionType === 'isBoolean' ? {
        valueBoolean,
      } : {
        label,
        minValueNumber,
        maxValueNumber,
      };

      return {
        primaryQuestion,
        category,
        certifier: userId,
        isCertifierPlatformUser: true,
        acceptableAnswers: [acceptableAnswer],
      };
    });

  console.log('atomicCriteriaArray', atomicCriteriaArray);
  const registeredCriteriaArray = await Promise.all(
    atomicCriteriaArray.map((atomicCriterionData) => app.service('criteria').create(atomicCriterionData)),
  );

  const businessCriteriaArray = registeredCriteriaArray.map(
    ({
      _id,
      acceptableAnswers,
      primaryQuestion,
      certifier,
      category,
    }) => ({
      baseAtomicCriterion: _id,
      acceptableAnswers,
      user: userId,
      primaryQuestion,
      validExternalCertifications: [certifier],
      category,
      isSelfCertificationEvidenceAllowed: {
        value: true,
      },
    }),
  );

  const registeredBusinessCriteria = await Promise.all(
    businessCriteriaArray.map((businessCriterionData) => app.service('business-criteria').create(businessCriterionData)),
  );

  const updatedComplianceCheckPoints = [
    ...complianceCheckPoints,
    ...registeredBusinessCriteria
      .map(
        (registeredBusinessCriterion) => ({
          criterion: registeredBusinessCriterion._id,
        }),
      ),
  ];

  context.data.complianceCheckPoints = updatedComplianceCheckPoints;
  //   registeredBusinessCriteria [
  //   {
  //     validExternalCertifications: [],
  //     linkedBusinessCriteria: [],
  //     _id: 600db8b4ebbb444c7aee3baf,
  //     baseAtomicCriterion: 600db8b2ebbb444c7aee3bad,
  //     acceptableAnswers: [ [Object] ],
  //     user: 600b1251562684ca4ed2a28c,
  //     createdAt: 2021-01-24T18:13:08.839Z,
  //     updatedAt: 2021-01-24T18:13:08.839Z,
  //     __v: 0
  //   }
  // ]

  // registeredCriteriaArray [
  //   {
  //     publicComments: [],
  //     privateComments: [],
  //     linkedCriteria: [],
  //     _id: 600daf168b38804a484c5dc2,
  //     primaryQuestion: 'are workers paiud on time?',
  //     category: 'CHEMICAL_INPUTS',
  //     certifier: 600b1251562684ca4ed2a28c,
  //     isCertifierPlatformUser: true,
  //     acceptableAnswers: [ [Object] ],
  //     createdAt: 2021-01-24T17:32:06.346Z,
  //     updatedAt: 2021-01-24T17:32:06.346Z,
  //     __v: 0
  //   }
  // ]

  // baseAtomicCriterion: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'criteria',
  //   required: true,
  //   index: true,
  // },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'users',
  //   index: true,
  //   required: true,
  // },
  // validExternalCertifications: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'certifications',
  // }],
  // acceptableAnswers: [{
  //   label: String,
  //   minValueNumber: Number,
  //   maxValueNumber: Number,
  //   valueBoolean: Boolean,
  // }],
  // linkedBusinessCriteria: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'business-criteria',
  // }],

  console.log('registeredCriteriaArray', registeredCriteriaArray);
  console.log('registeredBusinessCriteria', registeredBusinessCriteria);
  console.log('updatedComplianceCheckPoints', updatedComplianceCheckPoints);

  // construct proper schema out of the filtered custom criteria
  // create atomic criteria
  // create business criteria
  // add all new criteria to transaction

  return context;
};
