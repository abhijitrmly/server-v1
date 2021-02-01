// compliance-business-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'complianceBusiness';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      index: true,
      required: true,
    },
    criterion: {
      type: Schema.Types.ObjectId,
      ref: 'criteria',
      index: true,
      required: true,
    },
    isCompliant: {
      type: Boolean,
      default: false,
      required: true,
    },
    answer: {
      valueNumber: Number,
      valueBoolean: Boolean,
    },
    evidence: {
      externalCertified: [{
        certifier: {
          type: Schema.Types.ObjectId,
          ref: 'certifications',
          index: true,
          required: true,
        },
        acceptableAnswerLabels: [String],
        valueNumber: Number,
        valueBoolean: Boolean,
        isCompliant: {
          type: Boolean,
          default: false,
        },
      }],
      selfAudited: {
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
          required: true,
        },
        complianceApprovedOn: Date,
        images: [{ type: String, comment: String }],
        videos: [{ type: String, comment: String }],
        documents: [{ type: String, comment: String }],
      },
    },
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
