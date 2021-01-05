// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { result = {}, app } = context;
    console.log('result', result);
    const { parentTransaction = [] } = result;

    if (parentTransaction.length > 0) {
      const populatedParentTransactions = await Promise.all(
        parentTransaction.map(
          tr => app.service('journeys').get(tr.parentId)
        ),
      );
      context.result.populatedParentTransactions = populatedParentTransactions;
    }

    return context;
  };
};
