require('dotenv').config();
const { MONETBIL_SERVICE_KEY } = process.env;
const fetch = require('node-fetch');
const models = require('../../models');
const bitcoin = require('./transactions/bitcoin');
const ethereum = require('./transactions/ethereum');
const token = require('./transactions/token');
const bsctoken = require('./transactions/bsctoken');
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
    const amount_usd = req.body.amount_usd;
    const txtype = "buycrypto";
    const momo_method = req.body.momo_method;
    const currency = req.body.currency;
    const country = req.body.country;
    const phone = req.body.phone;
    var amount = req.body.amount_local;

    const cryptoRequest = await models.Crypto.findOne({where:{
        crypto_name: crypto_name
      }})
  
      //crypto info
      const crypto = cryptoRequest.dataValues;
      var crypto_name_market = crypto.crypto_name_market;
      var crypto_type = crypto.crypto_type;
      var crypto_blockchain = crypto.blockchain;


      const userRequest = await models.user.findOne({where:{
          uuid: uuid
      }})
      const user = userRequest.dataValues;
    if(user)
    {
        //rate local dollar
        const rateRequest = await models.rate.findOne({where:{
            currency:currency
        }})
        var rate = rateRequest.dataValues.value_buy;
                
        //convert
        var url=`https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=usd`; 
        var response = await fetch(url,{method: "GET"});
        var result = await response.json(); 
        var price = result[crypto_name_market].usd;
        const fee_usd = price*Number(txfee);
        const fee_amount_local = fee_usd * rate;

        amount += fee_amount_local; //add fee to the amount.

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

        console.log(phoneNumber,country_code,method)
        
        var paymentObject =  {
            service : "yBeM7buRXlNiV9UQ2TfMjVbTlpj9bg6h",
            phonenumber: phoneNumber,
            amount: amount,
            operator: method,
            currency: currency,
            country: country_code,
        }

        var paymentRequest = await fetch(placePaymentUrl,{
            method: "POST",
            body: JSON.stringify(paymentObject)
        })
        var paymentResult = await paymentRequest.json();
        const paymentID = paymentResult.paymentId;
        const status = paymentResult.status;

        const buyObject = {
            crypto_name : crypto_name,
            uuid : uuid,
            value: value,
            amount_usd : amount_usd,
            fees_usd: fee_usd,
            amount_local : amount,
            txfee : txfee,
            txtype : txtype,
            momo_method : momo_method,
            currency : currency,
            country : country,
            status : status,
            rate : rate,
            status: status,
            paymentID : paymentID
        }

        if(status == "REQUEST ACCEPTED")
        {
            if(crypto_type == "coin")
            {
                if(crypto_name == "bitcoin")
                {
                    bitcoin.send(buyObject);
                }
                else if(crypto_name == "ethereum")
                {
                    ethereum.send(buyObject);
                }
                else if(crypto_name == "binance")
                {

                }
            }
            else
            {
                if(crypto_type == "token" && crypto_blockchain == "ethereum")
                {
                    token.send(buyObject);
                }
                else if(crypto_type == "token" && crypto_blockchain == "binance")
                {
                    bsctoken.send(buyObject);
                }
                
            }

            res.status(200).json({
                status : 200,
                message : paymentResult.status,
                data : {
                    payment : paymentResult,
                    transaction: buyObject
                }
            })
        }
        else
        {
            res.status(500).json({
                status: 500,
                message : paymentResult.status,
                data : paymentResult
            })
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