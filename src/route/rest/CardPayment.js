const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const querystring = require("qs");
const PaymentService = require("../../service/PaymentService.js");
const BillService = require("../../service/BillService.js");
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
  try {
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
  } catch (error) {
    console.log(error.message);
    if (error.message === "Bill not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "VNPay not supported") {
      res.status(400).json({ message: error.message });
    } else if (error.message === "User not authorized") {
      res.status(401).json({ message: error.message });
    } else if (error.message === "Bill already paid") {
      res.status(400).json({ message: error.message });
    } else if (error.message === "Failed to update transaction code") {
      res.status(500).json({ message: error.message });
    } else if (error.message === "Failed to update payment status") {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
});

router.get("/vnpay/return",async function (req, res, next) {
  console.log("return from vnpay");
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = process.env.VNP_HASH_SECRET;

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    console.log(vnp_Params["vnp_ResponseCode"]);
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    res.send({ code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.send({ code: "97" });
  }
});

router.get("/vnpay_ipnn", async function (req, res, next) {
  console.log("vnpay call to server");
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let transactionCode = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];
  let amount = vnp_Params["vnp_Amount"];
  console.table({transactionCode, rspCode, amount})

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = process.env.VNP_HASH_SECRET;
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  let paymentStatus = "PENDING"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
  console.log(paymentStatus);
  // const checkOrderId = await BillService.checkTransactionCode(transactionCode);
  // let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  const {checktransactionCode, checkAmount, billId} = await BillService.checkTransaction(transactionCode, (amount / 100).toFixed(2));
  console.log(`transactionStatus ${checktransactionCode} \n checkAmount ${checkAmount}`);
  // let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (checktransactionCode) {
      if (checkAmount) {
        if (paymentStatus === "PENDING") {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode === "00") {
            //thanh cong
            paymentStatus = "1";
            console.log(paymentStatus);
            await BillService.updatePaymentStatus(billId, "SUCCESS");
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            console.log(' 00 thanh cong')
            res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
          } else {
            //that bai
            paymentStatus = "2";
            console.log(paymentStatus);
            
            await BillService.updatePaymentStatus(billId, "FAILD");
            console.log(' 01 that bai')
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
          }
        } else {
          console.log(' 02 da thanh toan')
          res
            .status(200)
            .json({
              RspCode: "02",
              Message: "This order has been updated to the payment status",
            });
        }
      } else {
        console.log(' 04 so tien khong hop le')
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      console.log(' 01 ma don hang khong ton tai')
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    console.log(' 97 checksum failed')
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
});

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};
module.exports = router;
