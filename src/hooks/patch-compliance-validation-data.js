// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const {
    data = {}, params = {}, app, id,
  } = context;
  const { user = {} } = params;
  const { _id: userId = '600b1251562684ca4ed2a28c' } = user;

  const { outgoingComplianceValidationData = {} } = data;
  const { complianceCheckPoints = {} } = outgoingComplianceValidationData;

  if (!Object.keys(complianceCheckPoints).length) {
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
