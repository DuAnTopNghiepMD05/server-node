const billService = require('./BillService.js');
const moment = require('moment')
const VNPayService = require('./VNPayService.js');
const createPayment = async (dto) => {
  const service = dto.service;
  const { billId, userId } = dto.paymentData;
  if (service === "vnpay") {
    const vnpRequirements = dto.vnpRequirements;
    const payment = await createVNPayPayment(billId, userId, vnpRequirements);
    return payment;
  } else {
    throw new Error("Service not found");
  }
};
const createVNPayPayment = async (billId, userId, vnpRequirements) => {
  const bill = await billService.getBillById(billId);
  console.log(bill)
  if (!bill) {
    throw new Error("Bill not found");
  } else if (!checkBillPaymentMethod(bill.paymentMethod, "vnpay")) {
    throw new Error("VNPay not supported");
  } else if (!checkBillOwnership(userId, bill.userId)) {
    throw new Error("User not authorized");
  } else if (bill.paymentStatus === "SUCCESS") {
    throw new Error("Bill already paid");
  } else {
    const {createDate, transactionCode} = generateTransactionCode();
    vnpRequirements = addTransactionCodeToVnpRequirements(vnpRequirements, createDate, transactionCode);
    const result = await billService.updateTransactionCode(billId, transactionCode)
    const paymentStatus = await billService.updatePaymentStatus(billId, "PENDING");
    if (!result) {
      console.log(result)
      throw new Error("Failed to update transaction code");
    }
    if (!paymentStatus) {
      console.log(paymentStatus)
      throw new Error("Failed to update payment status");
    }
    const payment = await VNPayService.createPaymentUrl(vnpRequirements, billId, userId);
    return payment;
  }
};
const addTransactionCodeToVnpRequirements = (vnpRequirements, createDate, transactionCode) => {
  return {
    ...vnpRequirements,
    createDate,
    transactionCode
  }
}
const generateTransactionCode = () => {
  const date = new Date();
  return {
    createDate: moment(date).format("YYYYMMDDHHmmss"),
    transactionCode: moment(date).format("DDHHmmss")
  }
}
const checkBillOwnership = (userId, billUserId) => {
  return userId === billUserId;
}
const checkBillPaymentMethod = (paymentMethod, method) => {
  return paymentMethod === method;
}
module.exports = { createPayment };
