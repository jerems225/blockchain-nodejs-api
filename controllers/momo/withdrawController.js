require('dotenv').config();
const {MONETBIL_SERVICE_KEY, MONETBIL_SECRET_KEY} = process.env;
const fetch = require('node-fetch');
const models = require('../../models');
const wdurl = "https://api.monetbil.com/v1/payouts/withdrawal";


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
async function createPayment(hash)
{
    //get transaction information
    const txRequest = await models.Transaction.findOne({where:{
        hash: hash
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

    console.log(phoneNumber)

    //initiate payment
    var withdrawObject =  {
        service_key: "yBeM7buRXlNiV9UQ2TfMjVbTlpj9bg6h",
        service_secret : "5E6YMWoQodcCe8Q4maE2XhP3PoEyaxMk1oDUORdoWLkA7iFiPviqDeqmmKpfG4N6",
        processing_number : hash,
        phonenumber: phoneNumber,
        amount: amount,
    }

    var withdrawRequest = await fetch(wdurl,{
        method: "POST",
        body: withdrawObject
    })
    var withdraw = await withdrawRequest.json();

    //if status == 200 update attribute paymentstatus and paymentid of transaction

    console.log(withdraw)
    process.exit();

}


module.exports = {
    getPaymentmethod : getPaymentmethod,
    showPaymentMethod : showPaymentMethod,
    createPayment : createPayment
}