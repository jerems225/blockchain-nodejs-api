require('dotenv').config();
const express = require('express');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceid = process.env.VERIFICATION_SERVICE_SID;
const number = process.env.TWILIO_NUMBER
const client = require('twilio')(accountSid, authToken);
const models = require('../../models');

async function sendCode(req,res)
{
    const from = number;
    const to = req.query.phone;

    // generate a 6 digit token
    const token = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const message = `GIT MOBILE - your KYC verification code is: ${token}`;

    var obj = {
        to: to,
        code: token
    }

    function storeToken(to, token) {
        //save in the database
        models.Twilio.create(obj).then(result => {
        console.log({
            status: 200,
            message: "Token saved successfully",
        });
        
        }).catch(error => {
        console.log({
                status : 500,
                message: "Something went wrong",
            });
        });
    }

    // send OTP
    client.messages.create({ body: message, from, to }).then((message) => {
    storeToken(to, token);
        res.send({
            status: 200,
            code: to,
            message: "Token send successfully",
        });
    });
}

async function verify(req,res)
{
    const code = req.query.code;
    const user = await models.Twilio.findOne({ where : 
      {
          code : res.query.code
      }});

      if(user)
      {
          res.send({
              status: 200,
              message: "Token valid"
          });
      }
      else
      {
          res.send({
              status: 500,
              message: "Token Invalid"
          });
      }
}


module.exports = {
    sendCode : sendCode,
    verify : verify
}



