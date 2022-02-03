require('dotenv').config();
const models = require('../../models');
const bitcoin = require('bitcoinjs-lib')
const {BTC_NODE_NETWORK_CORE}= require('../nodeConfig');


async function ownerwallet(req,res)
{
    const admin_uuid = req.query.uuid;
    const crypto_name = req.params.crypto_name;

    const user = await models.user.findOne({where : {
        uuid : admin_uuid
    }});

    if(user)
    {
        models.ownerwallets.findOne({where: {
            crypto_name : crypto_name
        }}).then(result => {
            if(crypto_name == "bitcoin")
            {
                let pubkey = result.dataValues.pubkey;
                var buffer = Buffer.from(pubkey,'hex');
                const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE});
                res.status(200).json({
                    status : 200,
                    message : "success",
                    data : {
                        crypto_name : crypto_name,
                        address : address
                    }
                })
            }
            else
            {
                res.status(200).json({
                    status : 200,
                    message : "success",
                    data : 
                        {
                            crypto_name : crypto_name,
                            address : result.dataValues.pubkey,
                        }
                })
            }
            
        }).catch((err) => {
            res.status(401).json({
                status : 401,
                message : "crypto not found",
                data : err
            })
        })
    }else
    {
        res.status(401).json({
            status : 401,
            message : "unknown user",
            data : null
        })
    }

}

module.exports = {
    ownerwallet
}
