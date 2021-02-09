/* eslint-disable no-underscore-dangle */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const { data, app } = context;
  const { supplierEmail } = data;

  let userId;

  try {
    const registeredUser = await app.service('users').findOne({ email: supplierEmail });
    userId = registeredUser._id;
  } catch (e) {
    const newRegisteredUser = await app.service('users').create({ email: supplierEmail });
    userId = newRegisteredUser._id;
  }

  context.data.supplier = userId;

  return context;
};
