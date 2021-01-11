// certifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'certifications';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true },
    awardedBy: String,
    isEthical: { type: Boolean, required: true, default: false },
    isEcofriendly: { type: Boolean, required: true, default: false },
    description: String,
    applicableOn: [String],
    trustworthiness: {
      type: String,
      enum: ['NEGLIGIBLE', 'LOW', 'MEDIUM', 'HIGH', 'EXCELLENT', 'UNKNOWN'],
      default: 'UNKNOWN',
      required: true,
    },
    logo: [{
      media: String,
      url: String,
    }],
  }, {
    timestamps: true,
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
