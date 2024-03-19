const express = require("express");
const router = express.Router();
const PaymentService = require("../../service/PaymentService.js");
router.post("", async (req, res) => {
  const service = req.query.service;
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;

  const orderInfo = req.body.orderDescription;
  const orderType = req.body.orderType;
  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }

  const { billId, userId } = req.body;
  const result = await PaymentService.createPayment({
    service: service,
    paymentData: { billId: billId, userId: userId },
    vnpRequirements: {
      ipAddr: ipAddr,
      amount: amount,
      bankCode: bankCode,
      orderInfo: orderInfo,
      orderType: orderType,
      locale: locale,
    },
  });
  if (result) {
    res.status(200).json({ paymentUrl: result });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
