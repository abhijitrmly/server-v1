// business-criteria-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function BusinessCriteria(app) {
  const modelName = 'businessCriteria';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    baseAtomicCriterion: {
      type: Schema.Types.ObjectId,
      ref: 'criteria',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      index: true,
      required: true,
    },
    primaryQuestion: { type: String, required: true },
    validExternalCertifications: [{
      type: Schema.Types.ObjectId,
      ref: 'certifications',
    }],
    acceptableAnswers: [{
      label: String,
      minValueNumber: Number,
      maxValueNumber: Number,
      valueBoolean: Boolean,
    }],
    isSelfCertificationEvidenceAllowed: {
      value: {
        type: Boolean,
        default: false,
      },
      comments: String,
    },
    linkedBusinessCriteria: [{
      type: Schema.Types.ObjectId,
      ref: 'business-criteria',
    }],
    category: {
      type: String,
      enum: ['CHEMICAL_INPUTS', 'PROHIBITED_INPUTS', 'SOCIAL_FREE_EMPLOYMENT', 'LABOUR_CONDITIONS'],
      required: true,
    },
    isCertifierPlatformUser: {
      type: Boolean,
    },
    referenceTerm: String,
    linkedCriteria: [{
      type: Schema.Types.ObjectId,
      ref: 'criteria',
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
