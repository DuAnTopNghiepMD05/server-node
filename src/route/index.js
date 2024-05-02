const express = require("express");
const router = express.Router();
const restRouter = require('./rest/index.js');
const mailRouter = require('./mail/index.js');
router.use('/api', restRouter);
router.use('/api', mailRouter);

module.exports = router;