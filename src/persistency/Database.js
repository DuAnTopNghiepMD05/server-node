const firestore = require('../configuration/Firestore.js');
const billNaming = require('../constant/BillNaming.js');
const billDocRef = firestore.collection(billNaming.BILL);
module.exports = {billDocRef};