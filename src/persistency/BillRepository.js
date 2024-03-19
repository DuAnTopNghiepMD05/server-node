const {billDocRef} = require("./Database.js");

const getAllBills = async () => {
  try {
    const snapshot = await billDocRef.get();
    return snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.log(error);
  }
};
const getBillById = async (id) => {
  const snapshot = await billDocRef.doc(id).get();
  const data = snapshot.data();
  return data;
};
module.exports = { getAllBills, getBillById };
