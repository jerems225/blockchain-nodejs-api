require('dotenv').config();
const models = require('../../models');
const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "9ac80880",
  apiSecret: "SxHBXrdWi1lvHauB"
})

async function sendCode(req,res)
{
    // const to = req.body.phone;
    const from = "GIT MOBILE APP";
    const to = "2250708561714";
    const uuid = req.body.uuid;
    

    // generate a 6 digit token
    const token = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const message = `GIT MOBILE - your KYC verification code is: ${token} `;

    var obj = {
        to: to,
        code: token,
        user_uuid : uuid
    }

    function storeToken() {
        //save in the database
        models.twilio.create(obj).then(result => {
        console.log({
            status: 200,
            message: "Token saved successfully",
        });
        
        }).catch(error => {
            res.status(500).json({
                status : 500,
                message: "Something went wrong",
            });
        });
    }

    //send OTP
    vonage.message.sendSms(from, to, message, (err, responseData) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: "Token not sent!",
                data : err
            });
        } else {
            if(responseData.messages[0]['status'] === "0") {
                storeToken();
                res.status(200).json({
                    status: 200,
                    to: to,
                    message: "Token sent successfully",
                    data : {
                        token : token
                    }
                });
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}

// sendCode();

async function verify(req,res)
{
    const code = req.body.code;
    const user_uuid = req.body.uuid
    const user = await models.twilio.findOne({ where : 
      {
          user_uuid : user_uuid,
          code : code
      }});

      if(user)
      {
          res.status(200).json({
              status: 200,
              message: "Token valid"
          });
      }
      else
      {
          res.status(500).json({
              status: 500,
              message: "Token Invalid"
          });
      }
}

// verify("848629")


module.exports = {
    sendCode : sendCode,
    verify : verify
}



