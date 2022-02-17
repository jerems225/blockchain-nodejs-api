const express = require('express');
const router = express.Router();
const { createWallet } = require('../controllers/simplyendpoints/createWallet');
const { cryptoModel, cryptoModelStakable } = require('../controllers/simplyendpoints/cryptomodel');
const { oldcryptoModel, oldcryptoModelStakable } = require('../controllers/simplyendpoints/oldcryptomodel');

router.post("/createwallets",createWallet);
router.get("/cryptomodels/:uuid",cryptoModel);
router.get("/cryptomodels/stakable/:uuid",cryptoModelStakable);

//old
router.get("/cryptomodels/:crypto_name/:uuid",oldcryptoModel);
router.get("/cryptomodels/stakable/:crypto_name/:uuid",oldcryptoModelStakable);

module.exports = router;