require('dotenv').config();
const express = require('express');
const router = express.Router();

/*
 * Basic health check - check environment variables have been
 * configured correctly
 */
router.get('/config', function(request, response) {
    response.json( {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY: process.env.TWILIO_API_KEY,
      TWILIO_API_SECRET: process.env.TWILIO_API_SECRET != '',
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      APP_HASH: process.env.APP_HASH,
      VERIFICATION_SERVICE_SID: process.env.VERIFICATION_SERVICE_SID,
      COUNTRY_CODE: process.env.COUNTRY_CODE,
    });
  });
  
  module.exports =  router;