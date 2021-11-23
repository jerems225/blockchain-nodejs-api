require('dotenv').config();
const  MONETBIL_SERVICE_KEY = "yBeM7buRXlNiV9UQ2TfMjVbTlpj9bg6h";
const fetch = require('node-fetch');
const models = require('../../models');
const bitcoin = require('../transactions/bitcoin');
const ethereum = require('../transactions/ethereum');
const token = require('../transactions/token');
const placePaymentUrl = "https://api.monetbil.com/payment/v1/placePayment";

//activate payment method
// momo_method,currency,country,phone,value,crypto_name
//active function for send asset

async function createPayment(req,res)
{
    const txfee = req.body.txfee;
    const uuid = req.body.uuid;
    const crypto_name = req.body.crypto_name;
    const value = req.body.value;
    const txtype = "buycrypto";
    const momo_method = req.body.momo_method;
    const currency = req.body.currency;
    const country = req.body.country;
    const phone = req.body.phone;

    const cryptoRequest = await models.Crypto.findOne({where:{
        crypto_name: crypto_name
      }})
  
      //crypto info
      const crypto = cryptoRequest.dataValues;
      var crypto_name_market = crypto.crypto_name_market;
      var crypto_type = crypto.crypto_type;


      const userRequest = await models.user.findOne({where:{
          uuid: uuid
      }})

      const user = userRequest.dataValues;

    if(user)
    {
        //convert
        var url=`https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=usd`; 
        var response = await fetch(url,{method: "GET"});
        var result = await response.json(); 
        var price = result[crypto_name_market].usd;
        var amount_usd = price*Number(value);
        // amount_usd = 58000 * value;

        //get momo informations
        const momoRequest = await models.momo.findOne({where:{
            country: country
        }})
        const datas = momoRequest.dataValues;
        const code = datas.code;
        const methods = datas.channel;
        const country_code = datas.symbol;
        var method;
        methods.forEach(element => {
            if(element == momo_method)
            {
                method = element;
            }
        });
        var phoneNumber = code+phone;

        const rateRequest = await models.rate.findOne({where:{
            currency:currency
        }})
        var rate = rateRequest.dataValues.value_buy;
        var amount = rate*Number(amount_usd);

        var paymentObject =  {
            "service": MONETBIL_SERVICE_KEY,
            "phonenumber": phoneNumber, 
            "amount": amount,
            "operator": method,
            "currency": currency,
            "country": country_code,
        }

        var paymentRequest = await fetch(placePaymentUrl,{
            method: "POST",
            body: paymentObject
        })
        var paymentResult = await paymentRequest.json();

        console.log(paymentResult)
        // process.exit();

        //if payment status == true
        var status = true;
        //check crypto_name
        if(crypto_type == "coin")
        {
            if(crypto_name=="bitcoin")
            {
                bitcoin.send(uuid,value,txfee,txtype,crypto_name,momo_method,currency,country,status,rate);
            }
            else if(crypto_name == "ethereum")
            {
                ethereum.send(uuid,value,txfee,txtype,crypto_name,momo_method,currency,country,status,rate);
            }
        }
        
        else
        {
            token.send(uuid,value,txfee,txtype,crypto_name,momo_method,currency,country,status,rate);
        }
    }
    else{
        res.status(401).json({
            status : 401,
            message: "unknown user",
            data: null
        });
    }
    
    
}



module.exports = {
    createPayment : createPayment
}