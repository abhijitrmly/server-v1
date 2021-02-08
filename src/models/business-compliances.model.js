// business-compliances-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'businessCompliances';
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
    providedExternalCertifications: [{
      type: Schema.Types.ObjectId,
      ref: 'certifications',
    }],
    providedAnswers: [{
      label: String,
      value: Number,
      valueBoolean: Boolean,
    }],
    providedEvidence: {
      imageUrls: [String],
      videoUrls: [String],
      documentUrls: [String],
      audioUrls: [String],
      otherUrls: [String],
    },
    linkedBusinessCompliances: [{
      type: Schema.Types.ObjectId,
      ref: 'business-compliances',
    }],
    category: {
      type: String,
      enum: ['PROHIBITED_INPUTS', 'CHEMICAL_INPUTS', 'SOCIAL_FREE_EMPLOYMENT'],
      required: true,
    },
    linkedBusinessCriteria: [{
      type: Schema.Types.ObjectId,
      ref: 'business-criteria',
    }],
    complianceValidation: {
      isCompliant: {
        type: Boolean,
        default: false,
      },
      complianceCheckStatus: {
        type: String,
        enum: ['OPEN', 'INPROGRESS', 'CLOSED'],
        default: 'OPEN',
      },
      complianceApprovedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true,
      },
      complianceApprovedOn: Date,
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
