// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => async (context) => {
  const { data = {}, app, params = {} } = context;
  const { query = {} } = params;
  const { searchField, searchValue } = query;

  console.log('embedded data', params);
  if (!searchField) {
    return context;
  }

  const mongooseClient = app.get('mongooseClient');

  const searchData = await mongooseClient.models.criteria.find(
    { [searchField]: searchValue },
  );

  context.result = searchData || { };

  return context;
};
