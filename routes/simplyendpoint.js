const express = require('express');
const router = express.Router();
const { createWallet } = require('../controllers/simplyendpoints/createWallet');

router.post("/createwallets",createWallet);

module.exports = router;