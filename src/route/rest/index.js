const express = require("express");
const router = express.Router();

const cardPayment = require('./CardPayment.js');
const mailRouter = require('../mail/index.js');
router.use('/card-payment', cardPayment);
router.use('/v1/orders/', mailRouter);
module.exports = router;