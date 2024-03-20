const {billDocRef} = require("./Database.js");

const getAllBills = async () => {
  try {
    const snapshot = await billDocRef.get();
    return snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.log(error);
  }
};
const getBillByTransactionCode = async (transactionCode) => {
  const snapshot = await billDocRef.where("transactionCode", "==", transactionCode).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });
}
const getBillById = async (id) => {
  const snapshot = await billDocRef.doc(id).get();
  const data = snapshot.data();
  return data;
};
const updateTransactionCode = async (billId, transactionCode) => {
  // const result = await billDocRef.doc(billId).collection('transactions').add({transactionCode: transactionCode})
  const result = await billDocRef.doc(billId).update({transactionCode: transactionCode});
  return result;
}
const updatePaymentStatus = async (id, status) => {
  const result = await billDocRef.doc(id).update({paymentStatus: status});
  return result;
}
module.exports = { getAllBills, getBillById, updateTransactionCode, getBillByTransactionCode, updatePaymentStatus};
