const models = require('../../models');

async function convert(req,res)
{
    const currency = req.params.currency;
    const value_usd = req.query.value_usd;

    const rate = await models.rate.findOne({where: {
        currency : currency
    }});

    var convert = rate.dataValues.value * Number(value_usd);

    res.status(200).json({
        status: 200,
        message: "value convert successfully",
        data: {
            currency: rate.dataValues.currency,
            amount: convert
        }
    });
}


module.exports = {
    convert : convert
}