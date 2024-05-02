const express = require("express");
const router = express.Router();
const mailRouter = require('../../configuration/Mail.js');
router.post('/api-mail;', mailRouter);

module.exports = router;