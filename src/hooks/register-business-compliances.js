// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const text = {
  '6011a8ef2f584a1943139525':
{
  acceptableCertificationsObject: {
    '600442aa5f936d5dce056dff': true,
  },
},
  '6011a8ef2f584a1943139524': {
    selfEvidences: [{
      tempId: 1612201031258,
      url: 'yyyyy',
    }],
  },
};

module.exports = ({ paramTransactionValue, complianceValues, user }) => {
  const {
    baseAtomicCriterion,
    primaryQuestion,
    category,
    _id: linkedBusinessCriterion,
    acceptableCertificationsObject = [],
  } = paramTransactionValue;

  const {
    acceptableCertificationsObject: answerAcceptableCertificationsObject = {},
    selfEvidences = [],
  } = complianceValues;
  const { answers = {} } = answerAcceptableCertificationsObject;

  const returnObject = {
    baseAtomicCriterion,
    user,
    primaryQuestion,
    category,
    providedExternalCertifications: Object.entries(acceptableCertificationsObject).filter(
      ([, certificationValue]) => !!certificationValue,
    ).map(([certificationId]) => certificationId),
    providedEvidence: selfEvidences.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        otherUrls: [...accumulator.otherUrls, (currentValue.url)],
      }), {
        imageUrls: [],
        videoUrls: [],
        documentUrls: [],
        audioUrls: [],
        otherUrls: [],
      },
    ),
    linkedBusinessCriteria: [linkedBusinessCriterion],
    providedAnswers: Object.entries(answers).map(
      ([, answer]) => ({
        valueBoolean: answer.valueBoolean,
        value: answer.value,
      }),
    ),
  };

  return (returnObject);
};
