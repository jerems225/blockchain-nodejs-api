const express = require('express');
const router = express.Router();
const { createWallet } = require('../controllers/simplyendpoints/createWallet');
const { cryptoModel } = require('../controllers/simplyendpoints/cryptomodel');

router.post("/createwallets",createWallet);
router.get("/cryptomodels/:crypto_name/:uuid",cryptoModel);

module.exports = router;