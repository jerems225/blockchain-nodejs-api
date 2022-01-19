require('dotenv').config();
const api_key = ""
var messagebird = require('messagebird')('7mBA9NhXJfNf2xmOw8Za6i8e3');
// const models = require('../../models');

async function sendCode(to)
{
    // const from = number;
    // const to = req.query.phone;

    var params = {
        originator: 'GIT MOBILE APP'
        };
        messagebird.verify.create(to, params, function (err, response) {
        if (err) {
            return console.log(err);
            }
            console.log(response);
        });

    // // generate a 6 digit token
    // const token = Math.floor(Math.random() * (999999 - 100000) + 100000);
    // const message = `GIT MOBILE - your KYC verification code is: ${token}`;

    // var obj = {
    //     to: to,
    //     code: token
    // }

    // function storeToken() {
    //     //save in the database
    //     models.Twilio.create(obj).then(result => {
    //     console.log({
    //         status: 200,
    //         message: "Token saved successfully",
    //     });
        
    //     }).catch(error => {
    //     console.log({
    //             status : 500,
    //             message: "Something went wrong",
    //         });
    //     });
    // }

    // send OTP
    // client.messages.create({ body: message, from, to }).then((message) => {
    // storeToken();
    //     res.send({
    //         status: 200,
    //         code: to,
    //         message: "Token send successfully",
    //     });
    // });
}

// sendCode("2250564422052");

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



