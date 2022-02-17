const express = require('express');
const router = express.Router();
const { createWallet } = require('../controllers/simplyendpoints/createWallet');
const { cryptoModel, cryptoModelStakable } = require('../controllers/simplyendpoints/cryptomodel');

router.post("/createwallets",createWallet);
router.get("/cryptomodels/:uuid",cryptoModel);
router.get("/cryptomodels/stakable/:uuid",cryptoModelStakable);

module.exports = router;