// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const {
    data = {}, app, id,
  } = context;

  const { outgoingComplianceValidationData = {} } = data;
  const { complianceCheckPoints = {} } = outgoingComplianceValidationData;

  if (!Object.keys(complianceCheckPoints).length) {
    delete context.data.outgoingComplianceValidationData;
    return context;
  }

  const approvedComplianceCheckpointIds = [];
  const disapprovedComplianceCheckpointIds = [];

  Object.entries(complianceCheckPoints).forEach(
    ([complianceId, complianceValue]) => {
      if (complianceValue.isCompliant) {
        approvedComplianceCheckpointIds.push(complianceId);
      } else {
        disapprovedComplianceCheckpointIds.push(complianceId);
      }
    },
  );

  const mongooseClient = app.get('mongooseClient');

  try {
    await mongooseClient.models.transaction.updateMany(
      { _id: id },
      {
        $set: {
          'complianceCheckPoints.$[elem].customerComplianceValidation': {
            isCompliant: true,
          // complianceAddedOn: dateNow.toISOString(),
          },
        },
      },
      { arrayFilters: [{ 'elem._id': { $in: approvedComplianceCheckpointIds } }] },
    );
  } catch (e) {
    console.error('Error', e);
  }

  context.result = {};
  return context;
};
