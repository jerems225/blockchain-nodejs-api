require('dotenv').config();
const models = require('../../models');

async function getallcrypto(req,res)
{
    const admin_uuid = req.query.uuid;
    // verification if uuid is exist and valid before run code
     const user = await models.user.findOne({ where :
      {
        uuid : admin_uuid,
      }});
      if(user)
      {
        if(user.dataValues.roles[0] == "ROLE_ADMIN")
        {
            const cryptos = await models.Crypto.findAll();
            if(cryptos.length != 0)
            {
                res.status(200).json({
                    status: 200,
                    message: `Total of crypto in this platform.`,
                    data : cryptos
                });
            }
            else
            {
                res.status(401).json({
                    status: 401,
                    message: `No crypto available`,
                    data : null
                });
            }
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `This user doesn't have access for that endpoint.`,
                data : null
            });
        }
      }
      else
      {
        res.status(401).json({
            status: 401,
            message: `Unknown user.`,
            data : null
        });
      }
}

async function getallcrypto_token(req,res)
{
    const admin_uuid = req.query.uuid;
    // verification if uuid is exist and valid before run code
     const user = await models.user.findOne({ where :
      {
        uuid : admin_uuid,
      }});
      if(user)
      {
        const cryptos = await models.Crypto.findAll({where:{
            crypto_type: "token"
        }});
        if(cryptos.length != 0)
        {
            res.status(200).json({
                status: 200,
                message: `Total of crypto token in this platform.`,
                data : cryptos
            });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `No crypto available`,
                data : null
            });
        }
      }
      else
      {
        res.status(401).json({
            status: 401,
            message: `Unknown user.`,
            data : null
        });
      }
}

async function getallcrypto_coin(req,res)
{
    const admin_uuid = req.query.uuid;
    // verification if uuid is exist and valid before run code
     const user = await models.user.findOne({ where :
      {
        uuid : admin_uuid,
      }});
      if(user)
      {
        const cryptos = await models.Crypto.findAll({where:{
            crypto_type: "coin"
        }});
        if(cryptos.length != 0)
        {
            res.status(200).json({
                status: 200,
                message: `Total of crypto coin in this platform.`,
                data : cryptos
            });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `No crypto available`,
                data : null
            });
        }
      }
      else
      {
        res.status(401).json({
            status: 401,
            message: `Unknown user.`,
            data : null
        });
      }
}

module.exports = {
    getallcrypto : getallcrypto,
    getallcrypto_token : getallcrypto_token,
    getallcrypto_coin : getallcrypto_coin
}