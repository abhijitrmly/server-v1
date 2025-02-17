const TransactionFactory = require('../models/transaction.model');

const users = require('./users/users.service.js');
const transaction = require('./transaction/transaction.service.js');
const member = require('./member/member.service.js');
const material = require('./material/material.service.js');
const certifications = require('./certifications/certifications.service.js');
const journeys = require('./journeys/journeys.service.js');
const criteria = require('./criteria/criteria.service.js');
const complianceBusiness = require('./compliance-business/compliance-business.service.js');
const businessCriteria = require('./business-criteria/business-criteria.service.js');
const businessCertifications = require('./business-certifications/business-certifications.service.js');
const businessCompliances = require('./business-compliances/business-compliances.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  const TransactionModel = TransactionFactory(app);

  app.configure(users);
  app.configure(transaction(TransactionModel));
  app.configure(member);
  app.configure(material);
  app.configure(certifications);
  app.configure(journeys(TransactionModel));
  app.configure(criteria);
  app.configure(complianceBusiness);
  app.configure(businessCriteria);
  app.configure(businessCertifications);
  app.configure(businessCompliances);
};
