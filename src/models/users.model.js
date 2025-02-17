// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const schema = new mongooseClient.Schema({
    email: {
      type: String, required: true, unique: true, lowercase: true,
    },
    password: { type: String },
    name: String,
    businessName: String,
    profilePicture: String,
    googleId: { type: String },
    brandingLabels: [{
      field: String,
      fieldValue: String,
    }],
  }, {
    timestamps: true,
    strict: 'throw',
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
