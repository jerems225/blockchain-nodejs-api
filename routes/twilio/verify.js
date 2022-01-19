const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const { sendCode, verify } = require('../../controllers/twilio/verify');
// create application/json parser
var jsonParser = bodyParser.json();

router.post("/twilio/otp/request", jsonParser,sendCode);
router.post("/twilio/verify", jsonParser,verify);

module.exports =  router;