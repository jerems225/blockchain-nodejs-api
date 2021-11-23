const models = require('../../models');

async function convert(req,res)
{
    const currency = req.params.currency;
    const operation = req.params.operation;
    const value_usd = req.query.value_usd;
    var convert;

    const rate = await models.rate.findOne({where: {
        currency : currency
    }});

    if(operation == "buy")
    {
        convert = rate.dataValues.value_buy * Number(value_usd);
    }
    else{
        if(operation == "sell")
        {
            convert = rate.dataValues.value_sell * Number(value_usd);
        }
    }
    

    res.status(200).json({
        status: 200,
        message: "value convert successfully",
        data: {
            operation: operation,
            currency: rate.dataValues.currency,
            amount: convert
        }
    });
}


module.exports = {
    convert : convert
}