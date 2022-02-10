require('dotenv').config();
const { BASE_IP } = process.env;
const models = require('../../models');
const fetch = require('node-fetch');

async function createWallet()
{
    setInterval( async function run()
    {
    const users = await models.user.findAll();
    users.forEach(async (u) => {
        const cryptos = await models.Crypto.findAll();
        cryptos.forEach(async (c) => {
            const walletRequest = await models.Wallet.findOne({ where : {
                user_uuid : u.uuid,
                crypto_name : c.crypto_name
            }});
            if(!walletRequest)
            {
                //create wallet for the specific
                const url = `http://${BASE_IP}/${c.crypto_symbol}/createwallet?uuid=${u.uuid}`;
                const req = await fetch(url,{
                    method : "POST"
                });
                const res = await req.json();
                console.log(res);
            }
        })
    });
    },100)
    
}

async function addCrypto(req,res)
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
    const prefix = req.body.prefix
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
                  available : available,
                  prefix: prefix
                }
            //save in the database
            models.Crypto.create(obj).then(result => {
                  res.status(200).json({
                    status: 200,
                    message: `${crypto_name} add successfully`,
                    datas: result
                });

                async function ownerwallet(crypto_name)
                {
                    //create eth account
                    var account = await models.ownerwallet.findOne({ where : 
                        {
                            crypto_name : crypto_name
                        }})
            
                        const walletObject = {
                            crypto_name : obj.crypto_name,
                            pubkey : account.dataValues.pubkey,
                            privkey : account.dataValues.privkey,
                            mnemonic : "N/A",
                        }
                    
                        //save in the database
                        models.ownerwallet.create(walletObject).then(result => {
                        console.log({
                            status: 200,
                            message: "Wallet created successfully",
                            wallet : result
                        });
                        
                        }).catch(error => {
                        console.log({
                            status : 500,
                            message: "Something went wrong",
                            error : error
                        });
                        });
                }
                //create owner wallet associate
                if(obj.blockchain == "ethereum" && obj.crypto_type == "token")
                {
                    ownerwallet("ethereum");
                }
                else if(obj.blockchain == "binance" && obj.crypto_type == "token")
                {
                    ownerwallet("binance");
                }
            
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
    addCrypto : addCrypto,
    createWallet :createWallet
}