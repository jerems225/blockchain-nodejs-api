require('dotenv').config();
const fetch = require('node-fetch');
const models = require('../../models');
const placePaymentUrl = "https://api.monetbill.com/payment/v1/placePayment";


async function getPaymentmethod(req,res)
{
    const momo = await models.momo.findAll();

    res.status(200).json({
        status: 200,
        message: "All Payment Methods",
        data: momo
    });
}

async function showPaymentMethod(req,res)
{
    const country = req.params.country;
    const momo = await models.momo.findOne({where: {
        country : country
    }});

    if(momo)
    {
        res.status(200).json({
            status: 200,
            message: "All payment methods available for this country",
            data: momo.dataValues
        });
    }
    else {
        res.status(500).json({
            status: 500,
            message: "No payment method available for this country",
            data: null
        });
    }
}

//activate payment method
async function createPayment(res,tx_hash)
{
    //get transaction information
    const txRequest = await models.Transaction.findOne({where:{
        hash: tx_hash
    }});

    const tx = txRequest.dataValues;
    const amount = tx.amountcurrency;
    const currency = tx.currency;
    const momo_method =  tx.momo_method;
    const phone = tx.phone;
    const country = tx.country;

    //get momo informations
    const momoRequest = await models.momo.findOne({where:{
        country: country
    }})
    const datas = momoRequest.dataValues;
    const code = datas.code;
    const country_code = datas.symbol;
    var phoneNumber = code+phone;

    //initiate payment
    var paymentObject =  {
        "service": MONETBIL_SERVICE_KEY,
        "phonenumber": phoneNumber, 
        "amount": amount,
        "operator": momo_method,
        "currency": currency,
        "country": country_code,
    }

    var paymentRequest = await fetch(placePaymentUrl,{
        method: "POST",
        body: paymentObject
    })
    var paymentResult = await paymentRequest.json();

    //if status == 200 update attribute paymentstatus of transaction

    console.log(paymentResult)
    // process.exit();

    
}


module.exports = {
    getPaymentmethod : getPaymentmethod,
    showPaymentMethod : showPaymentMethod,
    createPayment : createPayment
}