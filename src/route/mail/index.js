const express = require("express");
const router = express.Router();

const mailRouter = require('../../configuration/Mail.js');

router.post('/send-status',mailRouter.sendVerificationEmail) ;

module.exports = router;