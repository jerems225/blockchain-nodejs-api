/*
    Load Twilio configuration from .env config file - the following environment
    variables should be set:
    process.env.TWILIO_ACCOUNT_SID
    process.env.TWILIO_API_KEY
    process.env.TWILIO_API_SECRET
    process.env.APP_HASH
    process.env.VERIFICATION_SERVICE_SID
    process.env.COUNTRY_CODE
*/
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jsonBodyParser = require('body-parser').json();

// Twilio Library
const Twilio = require('twilio');


// Check configuration variables
if (process.env.TWILIO_API_KEY == null ||
    process.env.TWILIO_API_SECRET == null ||
    process.env.TWILIO_ACCOUNT_SID == null ||
    process.env.VERIFICATION_SERVICE_SID == null ||
    process.env.COUNTRY_CODE == null) {
  console.log('Please copy the .env.example file to .env, ' +
                    'and then add your Twilio API Key, API Secret, ' +
                    'and Account SID to the .env file. ' +
                    'Find them on https://www.twilio.com/console');
  process.exit();
}

if (process.env.APP_HASH == null) {
  console.log('Please provide a valid Android app hash, ' +
                'in the .env file');
  process.exit();
}

if (process.env.CLIENT_SECRET == null) {
  console.log('Please provide a secret string to share, ' +
                'between the app and the server ' +
                'in the .env file');
  process.exit();
}

const configuredClientSecret = process.env.CLIENT_SECRET;

// Initialize the Twilio Client
const twilioClient = new Twilio(process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    {accountSid: process.env.TWILIO_ACCOUNT_SID});

const SMSVerify = require('./SMSVerify.js');
const smsVerify = new SMSVerify(twilioClient,
    process.env.APP_HASH,
    process.env.VERIFICATION_SERVICE_SID,
    process.env.COUNTRY_CODE);

/*
    Sends a one-time code to the user's phone number for verification
*/
router.post('/api/request', jsonBodyParser, function(request, response) {
  const clientSecret = request.body.client_secret;
  const phone = request.body.phone;

  if (clientSecret == null || phone == null) {
    // send an error saying that both client_secret and phone are required
    response.send(500, 'Both client_secret and phone are required.');
    return;
  }

  if (configuredClientSecret != clientSecret) {
    response.send(500, 'The client_secret parameter does not match.');
    return;
  }

  smsVerify.request(phone);
  response.send({
    success: true,
  });
});

module.exports =  router;
