const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const ConvertController = require('../../controllers/momo/convertController');
const WithdrawController = require('../../controllers/momo/withdrawController');
const BuyCryptoController = require('../../controllers/momo/buyController');

router.get("/momo/convert/:operation/:currency",ConvertController.convert);
router.get("/momo/getpayment/methods",WithdrawController.getPaymentmethod);
router.get("/momo/payment/available/:country",WithdrawController.showPaymentMethod);
router.post("/momo/payment/buy/crypto",jsonParser,BuyCryptoController.createPayment);

module.exports =  router;