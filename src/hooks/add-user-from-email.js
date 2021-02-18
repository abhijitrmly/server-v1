/* eslint-disable no-underscore-dangle */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const { data, app } = context;
  const { supplierEmail } = data;

  let userId;

  const registeredUserData = await app.service('users').find({ query: { email: supplierEmail } });
  const { total = 0, data: responseData = [] } = registeredUserData;

  if (total === 0) {
    const newRegisteredUser = await app.service('users').create({ email: supplierEmail });
    userId = newRegisteredUser._id;
  } else {
    const [firstUserRecord = {}] = responseData;
    userId = firstUserRecord._id;
  }

  context.data.supplier = userId;

  return context;
};
