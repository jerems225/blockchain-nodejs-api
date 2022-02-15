const express = require('express');
const router = express.Router();
const { createWallet } = require('../controllers/simplyendpoints/createWallet');
const { cryptoModel, cryptoModelStakable } = require('../controllers/simplyendpoints/cryptomodel');

router.post("/createwallets",createWallet);
router.get("/cryptomodels/:crypto_name/:uuid",cryptoModel);
router.get("/cryptomodels/stakable/:crypto_name/:uuid",cryptoModelStakable);

module.exports = router;