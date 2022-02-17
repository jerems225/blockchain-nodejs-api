const express = require('express');
const router = express.Router();
const { createWallet } = require('../controllers/simplyendpoints/createWallet');
const { cryptoModel, cryptoModelStakable } = require('../controllers/simplyendpoints/cryptomodel');
const { cryptoModel, cryptoModelStakable } = require('../controllers/simplyendpoints/oldcryptomodel');

router.post("/createwallets",createWallet);
router.get("/cryptomodels/:uuid",cryptoModel);
router.get("/cryptomodels/stakable/:uuid",cryptoModelStakable);

//old
router.get("/cryptomodels/:crypto_name/:uuid",cryptoModel);
router.get("/cryptomodels/:crypto_name/stakable/:uuid",cryptoModelStakable);

module.exports = router;