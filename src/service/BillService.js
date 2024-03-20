const BillRepository = require("../persistency/BillRepository.js");
const billNaming = require("../constant/BillNaming.js");
const getBillById = async (id) => {
  const data = await BillRepository.getBillById(id);
  return dataToDTO(data);
};
const getAllBills = async () => {
  const data = await BillRepository.getAllBills();
  return data.map((bill) => dataToDTO(bill));
};
const updateTransactionCode = async (billId, transactionCode) => {
  const result = await BillRepository.updateTransactionCode(
    billId,
    transactionCode
  );
  return result;
};
const checkBillByTransactionCode = async (transactionCode) => {
  const bill = await BillRepository.getBillByTransactionCode(transactionCode);
  return bill;
}
const checkTransaction = async (transactionCode, amount) => {
  const bill = await BillRepository.getBillByTransactionCode(transactionCode);
  console.log(bill);
  if (bill.length > 0) {
    return {
      checktransactionCode: bill.length > 0,
      checkAmount:
        bill.length > 0 &&
        (bill[0][billNaming.TOTAL_AMOUNT] * 1).toFixed(2) === amount,
      billId: bill[0].id,
      paymentStatus: bill[0][billNaming.PAYMENT_STATUS],
    };
  }
  return {
    checktransactionCode: false,
    checkAmount: false,
    billId: null,
  };
};
const updatePaymentStatus = async (billId, status) => {
  const result = await BillRepository.updatePaymentStatus(billId, status);
  return result;
};
const dataToDTO = (data) => {
  return {
    userId: data[billNaming.ID],
    address: data[billNaming.ADDRESS],
    fullName: data[billNaming.FULL_NAME],
    orderDate: data[billNaming.ORDER_DATE],
    paymentMethod: data[billNaming.PAYMENT_METHOD],
    phone: data[billNaming.PHONE],
    totalAmount: data[billNaming.TOTAL_AMOUNT],
    orderStatus: data[billNaming.ORDER_STATUS],
    paymentStatus: data[billNaming.PAYMENT_STATUS],
    transactionCode: data[billNaming.TRANSACTION_CODE],

  };
};
module.exports = {
  getBillById,
  getAllBills,
  updateTransactionCode,
  checkTransaction,
  updatePaymentStatus,
  checkBillByTransactionCode
};
