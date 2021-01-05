// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const extractData = (originalArray, transaction) => {
  const { supplierBranding = {}, supplierType, itemPopulated = {}, supplierPopulated = {}, populatedParentTransactions = [] } = transaction;
  const {
    coverDesign = '', storyTitle = '', stepLabel = '', stepLocation = '',
  } = supplierBranding;

  const { brandingLabels = [], profilePicture } = supplierPopulated;

  const [supplierActivityLabel = {}] = brandingLabels;
  const { field, fieldValue } = supplierActivityLabel;

  const { labels = '' } = stepLocation;
  const { label: itemLabel = '', images = [] } = itemPopulated;
  const [itemImage = {}] = images;
  const { url: imageUrl = '' } = itemImage;

  let productImage = imageUrl;
  let productTitle = itemLabel;
  if (supplierType === 'SHIPPER') {
    productImage = profilePicture;
    productTitle = `${itemLabel} in transit`;
  }

  originalArray.push({
    coverDesign,
    storyTitle,
    stepLabel,
    labels,
    itemLabel: productTitle,
    imageUrl: productImage,
    field,
    fieldValue
  });

  const [populatedParentTransaction] = populatedParentTransactions;

  if (populatedParentTransaction) {
    extractData(originalArray, populatedParentTransaction);
  }
};

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { result = {}, app } = context;
    const { parentTransaction = [] } = result;

    if (parentTransaction.length > 0) {
      const populatedParentTransactions = await Promise.all(
        parentTransaction.map(
          tr => app.service('journeys').get(tr.parentId)
        ),
      );
      context.result.populatedParentTransactions = populatedParentTransactions;
    }

    const transactionDataArray = [];
    extractData(transactionDataArray, context.result);
    context.result.transactionDataArray = transactionDataArray;

    return context;
  };
};
