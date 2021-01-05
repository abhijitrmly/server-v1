const TransactionFactory = require('../models/transaction.model');

const users = require('./users/users.service.js');
const transaction = require('./transaction/transaction.service.js');
const member = require('./member/member.service.js');
const material = require('./material/material.service.js');
const certifications = require('./certifications/certifications.service.js');
const journeys = require('./journeys/journeys.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  const TransactionModel = TransactionFactory(app);

  app.configure(users);
  app.configure(transaction(TransactionModel));
  app.configure(member);
  app.configure(material);
  app.configure(certifications);
  app.configure(journeys(TransactionModel));
};
