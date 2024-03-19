const express = require("express");
const router = express.Router();
const restRouter = require('./rest/index.js');
router.use('/api', restRouter);

module.exports = router;