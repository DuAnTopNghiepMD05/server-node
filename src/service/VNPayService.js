
const crypto = require("crypto");
const querystring = require('qs');

const VNP_TMN_CODE = process.env.VNP_TMN_CODE;
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_RETURN_URL = process.env.VNP_RETURN_URL;

const createPaymentUrl = async (vnpRequirements, billId, userId) => {
  const tmnCode = VNP_TMN_CODE;
  const secretKey = VNP_HASH_SECRET;
  const baseVnpUrl = VNP_URL;
  const returnUrl = VNP_RETURN_URL;
  
  const currCode = "VND";
  const tempVnp_Params = {};
  tempVnp_Params["vnp_Version"] = "2.1.0";
  tempVnp_Params["vnp_Command"] = "pay";
  tempVnp_Params["vnp_TmnCode"] = tmnCode;
  tempVnp_Params['vnp_Merchant'] = 'MD-05'
  tempVnp_Params["vnp_Locale"] = vnpRequirements.locale;
  tempVnp_Params["vnp_CurrCode"] = currCode;
  tempVnp_Params["vnp_TxnRef"] = vnpRequirements.transactionCode;
  tempVnp_Params["vnp_OrderInfo"] = vnpRequirements.orderInfo || userId + " Thanh toán hóa đơn " + billId;
  tempVnp_Params["vnp_OrderType"] = vnpRequirements.orderType || 'vnpay';
  tempVnp_Params["vnp_Amount"] = vnpRequirements.amount * 100;
  tempVnp_Params["vnp_ReturnUrl"] = returnUrl;
  tempVnp_Params["vnp_IpAddr"] = vnpRequirements.ipAddr;
  tempVnp_Params["vnp_CreateDate"] = vnpRequirements.createDate;
  if (vnpRequirements.bankCode !== null && vnpRequirements.bankCode !== "") {
    tempVnp_Params["vnp_BankCode"] = vnpRequirements.bankCode;
  }

  const vnp_Params = sortObject(tempVnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  const vnpUrl = baseVnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });
  return vnpUrl;
}

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
}
module.exports = { createPaymentUrl };