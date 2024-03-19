const admin = require("firebase-admin");

const SERVICE_ACCOUNT_FILE_NAME = process.env.SERVICE_ACCOUNT;
const serviceAccount = require('../../' + SERVICE_ACCOUNT_FILE_NAME);

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;