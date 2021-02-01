// business-certifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'businessCertifications';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    baseStandard: {
      type: Schema.Types.ObjectId,
      ref: 'certifications',
      index: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      index: true,
      required: true,
    },
    certificationId: String,
    awardedOn: Date,
    awardedUntil: Date,
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isValid: {
      type: Boolean,
      required: true,
      default: false,
    },
    private: {
      comments: [String],
    },
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
