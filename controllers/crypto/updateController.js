const models = require('../../models');

async function UpdateCrypto(req,res)
{
    const admin_uuid = req.body.uuid;
    const crypto_symbol = req.body.crypto_symbol;
    const crypto_name = req.body.crypto_name;
    const contract_address = req.body.contract_address;
    const contract_address_test = req.body.contract_address_test;
    const contract_abi = req.body.contract_abi;
    const contract_abi_test = req.body.contract_abi_test;
    const amount_min = req.body.amount_min;
    const staking_amount_min = req.body.staking_amount_min;
    const staking_amount_max = req.body.staking_amount_max;
    const stakable = req.body.stakable;
    const crypto_type = req.body.crypto_type;
    const crypto_name_market = req.body.crypto_name_market;
    const blockchain = req.body.blockchain;
    const available = req.body.availbale;
    // verification if uuid is exist and valid before run code
     const user = await models.user.findOne({ where :
      {
        uuid : admin_uuid,
      }});
      if(user)
      {
        if(user.dataValues.roles[0] == "ROLE_ADMIN")
        {
            const obj = {
                  crypto_name: crypto_name,
                  crypto_symbol: crypto_symbol,
                  contract_address: contract_address,
                  contract_abi: contract_abi,
                  contract_address_test: contract_address_test,
                  contract_abi_test: contract_abi_test,
                  amount_min: amount_min,
                  staking_amount_min: staking_amount_min,
                  staking_amount_max: staking_amount_max,
                  stakable: stakable,
                  crypto_type: crypto_type,
                  crypto_name_market : crypto_name_market,
                  blockchain : blockchain,
                  available : available
                }
            //save in the database
            models.Crypto.update(obj,{where:{
                crypto_name : crypto_name
            }}).then(result => {
                  res.status(200).json({
                    status: 200,
                    message: `${crypto_name} add successfully`,
                    datas: result
                });
            }).catch(error => {
                res.status(500).json({
                    status : 500,
                    message: "Something went wrong",
                    error : error
                });
            });
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

module.exports = {
    UpdateCrypto : UpdateCrypto
}