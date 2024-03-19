const billService = require('./BillService.js');
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
  if (!bill) {
    throw new Error("Bill not found");
  } else if (!checkBillPaymentMethod(bill.paymentMethod, "vnpay")) {
    throw new Error("VNPay not supported");
  } else if (!checkBillOwnership(userId, bill.userId)) {
    throw new Error("User not authorized");
  } else {
    const payment = await VNPayService.createPaymentUrl(vnpRequirements);
    return payment;
  }
};
const checkBillOwnership = (userId, billUserId) => {
  return userId === billUserId;
}
const checkBillPaymentMethod = (paymentMethod, method) => {
  return paymentMethod === method;
}
module.exports = { createPayment };
