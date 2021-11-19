const express = require('express');
const router = express.Router();
const TwilioController = require('../../controllers/twilio/verify');

router.get("/twilio/otp/request", TwilioController.sendCode);
router.get("/twilio/verify", TwilioController.verify);

module.exports =  router;