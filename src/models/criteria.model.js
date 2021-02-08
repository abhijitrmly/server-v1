// criteria-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function CriteriaModel(app) {
  const modelName = 'criteria';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    primaryQuestion: { type: String, required: true },
    category: {
      type: String,
      enum: ['CHEMICAL_INPUTS', 'PROHIBITED_INPUTS', 'SOCIAL_FREE_EMPLOYMENT'],
      required: true,
    },
    certifier: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    isCertifierPlatformUser: {
      type: Boolean,
    },
    referenceTerm: String,
    acceptableAnswers: [{
      label: String,
      minValueNumber: Number,
      maxValueNumber: Number,
      valueBoolean: Boolean,
    }],
    publicComments: [String],
    privateComments: [String],
    linkedCriteria: [{
      type: Schema.Types.ObjectId,
      ref: 'criteria',
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
