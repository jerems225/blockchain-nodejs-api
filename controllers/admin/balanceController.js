const models = require('../../models');
const bitcoin = require('./balance/bitcoinBalance');
const ethereum = require('./balance/ethereumBalance');
const token = require('./balance/tokenBalance');

async function Balance(req,res)
{
    const admin_uuid = req.query.uuid;
    const crypto_name = req.query.crypto_name;

    const user = await models.user.findOne({
        where : {
            uuid : admin_uuid
        }
    });
    if(user)
    {
        if(crypto_name == "bitcoin")
        {
            
            bitcoin.getBalance(crypto_name,req,res);
        }
        else if(crypto_name == "ethereum")
        {
            ethereum.getBalance(crypto_name,req,res);
        }
        else
        {
            token.getBalance(crypto_name,req,res);
        }
    }
    else
    {
        res.status(401).json({
            status : 401,
            message : "unknown user",
            data : null
        })
    }
}

module.exports = {
    Balance
}