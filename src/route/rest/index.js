const express = require("express");
const router = express.Router();

const cardPayment = require('./CardPayment.js');

router.use('/card-payment', cardPayment);

module.exports = router;