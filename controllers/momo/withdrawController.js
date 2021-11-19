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

async function createPayment(res,momo_method)
{
    
}


module.exports = {
    getPaymentmethod : getPaymentmethod,
    showPaymentMethod : showPaymentMethod,
    createPayment : createPayment
}