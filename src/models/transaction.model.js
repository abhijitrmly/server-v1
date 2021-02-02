// transaction-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function TransactionModel(app) {
  const modelName = 'transaction';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      index: true,
      // @TODO required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      index: true,
      required: true,
    },
    complianceCheckPoints: [{
      criterion: {
        type: Schema.Types.ObjectId,
        ref: 'business-criteria',
        index: true,
        required: true,
      },
      complianceData: {
        type: Schema.Types.ObjectId,
        ref: 'business-compliances',
        // @TODO required: true,
      },
      customerComplianceValidation: {
        isCompliant: {
          type: Boolean,
          default: false,
        },
        complianceAddedOn: Date,
        comments: [String],
      },
    }],
    item: {
      type: Schema.Types.ObjectId,
      ref: 'material',
      index: true,
      // @TODO required: true,
    },
    transactionCompletedAt: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ['DRAFT', 'OPEN', 'CLOSED', 'FAILED', 'REJECTED'],
      default: 'OPEN',
      required: true,
    },
    parentTransaction: [{
      parentId: {
        type: Schema.Types.ObjectId,
        ref: 'transaction',
        index: true,
      },
      proportion: Number,
    }],
    childrenTransaction: [{
      childId: {
        type: Schema.Types.ObjectId,
        ref: 'transaction',
        index: true,
      },
      proportion: Number,
    }],
    supplierType: {
      type: String,
      enum: ['PRODUCER', 'PROCESSOR', 'CUSTOMER', 'SHIPPER', 'DISTRIBUTOR'],
      default: 'PRODUCER',
      // @TODO required: true,
    },
    brandedSupplier: {
      type: Boolean,
      default: false,
    },
    brandedCustomer: {
      type: Boolean,
      default: false,
    },
    customerType: {
      type: String,
      enum: ['PRODUCER', 'PROCESSOR', 'CUSTOMER', 'SHIPPER', 'DISTRIBUTOR'],
      default: 'SHIPPER',
      required: true,
    },
    supplierBranding: {
      stepLabel: String,
      stepLocation: {
        labels:
          [{
            type: String,
          }],
        params: Schema.Types.Mixed,
      },
      infoData: [{
        field: String,
        fieldValue: String,
      }],
      images: [{
        url: String,
        title: String,
        location: String,
      }],
      certifications: [{
        certificationType: {
          type: Schema.Types.ObjectId,
          ref: 'certifications',
          index: true,
        },
        certificationId: String,
        awardedOn: String,
        isVerified: {
          type: Boolean,
          required: true,
          default: false,
        },
        comments: [String],
      }],
      coverDesign: String,
      storyTitle: String,
    },
    customerBranding: {
      stepLabel: String,
      stepLocation: {
        labels:
          [{
            type: String,
          }],
        params: Schema.Types.Mixed,
      },
      infoData: [{
        label: String,
        value: String,
      }],
      images: [{
        url: String,
        title: String,
        location: String,
      }],
      certifications: [{
        certificationType: {
          type: Schema.Types.ObjectId,
          ref: 'certifications',
          index: true,
        },
        certificationId: String,
        awardedOn: String,
        isVerified: {
          type: Boolean,
          required: true,
          default: false,
        },
        comments: [String],
      }],
      coverDesign: String,
      storyTitle: String,
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
