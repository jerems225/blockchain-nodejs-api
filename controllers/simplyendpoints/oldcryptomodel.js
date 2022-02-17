const models = require("../../models");
const fetch = require('node-fetch');
const {BASE_IP} = process.env;

async function cryptoModel(req,res)
{
    const uuid = req.params.uuid;
    const crypto_name = req.params.crypto_name;
    const user = await models.user.findOne({where : {
        uuid : uuid
    }});

    if(user)
    {
        const cryptos = await models.Crypto.findOne({where: {crypto_name : crypto_name}});
        if(cryptos)
        {
            const cr = cryptos.dataValues;
            //get instance crypto information
            var prefix;
            var prefix_url = "";
            if(cr.prefix == null)
            {
                prefix = "N/A";
            }
            else
            {
                prefix_url = "/"+cr.prefix;
                prefix = cr.prefix;
            }
            var cr_info = {
                id: cr.id,
                prefix : prefix,
                crypto_name: cr.crypto_name,
                crypto_symbol: cr.crypto_symbol,
                crypto_type: cr.crypto_type,
                crypto_name_market: cr.crypto_name_market,
                stakable: cr.stakable,
                staking_amount_min: cr.staking_amount_min,
                available: cr.available,
                amount_min: cr.amount_min
            };
    
            //get crypto instance balance
            var bal_url = `https://${BASE_IP}${prefix_url}/${cr_info.crypto_symbol}/accountbalance/${uuid}`;
    
            // console.log(bal_url);
            // process.exit()
    
            var balanceRequest = await fetch(bal_url,{
                method: "GET"
            });
            var balanceResponse = await balanceRequest.json();
            const balance = balanceResponse.balance; //user wallet balance for crypto instance
    
            //get wallet balance for crypto instance in usd dollar value
            var usd_value_url = `https://api.coingecko.com/api/v3/simple/price?ids=${cr_info.crypto_name_market}&vs_currencies=usd`
            var usdrequest = await fetch(usd_value_url,{
                method: "GET"
            });
            var usdresponse = await usdrequest.json();
            var price_value = usdresponse[cr_info.crypto_name_market].usd; //usd price for crypto instance
            const usd_value = Number(balance)*price_value; // balance in usd dollar
    
            //get user address for instance crypto
            var address_url = `https://${BASE_IP}${prefix_url}/${cr_info.crypto_symbol}/wallet/getaddress?uuid=${uuid}`;
            var addressRequest = await fetch(address_url,{
                method: "GET"
            });
            var addressResponse = await addressRequest.json();
            const address = addressResponse.address; //user wallet address for crypto instance
    
            //get icon for crypto instance
            var icon_url = `https://api.coingecko.com/api/v3/coins/${cr_info.crypto_name_market}`;
            var iconresquest = await fetch(icon_url,{
                method: "GET"
            }); 
            var iconresponse = await iconresquest.json();
            const icon = iconresponse.image.thumb;
    
            //crypto model objet for crypto instance
            const response = {
                id: cr_info.id,
                prefix : cr_info.prefix,
                crypto_name: cr_info.crypto_name,
                crypto_symbol: cr_info.crypto_symbol,
                crypto_type: cr_info.crypto_type,
                crypto_name_market: cr_info.crypto_name_market,
                stakable: cr_info.stakable,
                staking_amount_min: cr_info.staking_amount_min,
                available: cr_info.available,
                amount_min: cr_info.amount_min,
                sym_balance: balance,
                dollar_value: usd_value,
                wallet_address: address,
                image: icon
            }
    
            //return response
    
            res.status(200).json({
                status: 200,
                message: "crypto model get successfully!",
                data : response
            });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: "this crypto doesn't exist in the system",
                data : null
            });
        }
       
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: "unknown user",
            data : null
        });
    }
}

async function cryptoModelStakable(req,res)
{
    const uuid = req.params.uuid;
    const crypto_name = req.params.crypto_name;
    const user = await models.user.findOne({where : {
        uuid : uuid
    }});

    if(user)
    {
        const cryptos = await models.Crypto.findOne({where:
             {
                 crypto_name : crypto_name,
                 available: true,
                 stakable: true
             }
        });
        if(cryptos)
        {
            const cr = cryptos.dataValues;
            //get instance crypto information
            var prefix;
            var prefix_url = "";
            if(cr.prefix == null)
            {
                prefix = "N/A";
            }
            else
            {
                prefix_url = "/"+cr.prefix;
                prefix = cr.prefix;
            }
            var cr_info = {
                id: cr.id,
                prefix : prefix,
                crypto_name: cr.crypto_name,
                crypto_symbol: cr.crypto_symbol,
                crypto_type: cr.crypto_type,
                crypto_name_market: cr.crypto_name_market,
                stakable: cr.stakable,
                staking_amount_min: cr.staking_amount_min,
                available: cr.available,
                amount_min: cr.amount_min
            };
    
            //get crypto instance balance
            var bal_url = `http://${BASE_IP}${prefix_url}/${cr_info.crypto_symbol}/accountbalance/${uuid}`;
    
            // console.log(bal_url);
            // process.exit()
    
            var balanceRequest = await fetch(bal_url,{
                method: "GET"
            });
            var balanceResponse = await balanceRequest.json();
            const balance = balanceResponse.balance; //user wallet balance for crypto instance
    
            //get wallet balance for crypto instance in usd dollar value
            var usd_value_url = `https://api.coingecko.com/api/v3/simple/price?ids=${cr_info.crypto_name_market}&vs_currencies=usd`
            var usdrequest = await fetch(usd_value_url,{
                method: "GET"
            });
            var usdresponse = await usdrequest.json();
            var price_value = usdresponse[cr_info.crypto_name_market].usd; //usd price for crypto instance
            const usd_value = Number(balance)*price_value; // balance in usd dollar
    
            //get user address for instance crypto
            var address_url = `http://${BASE_IP}${prefix_url}/${cr_info.crypto_symbol}/wallet/getaddress?uuid=${uuid}`;
            var addressRequest = await fetch(address_url,{
                method: "GET"
            });
            var addressResponse = await addressRequest.json();
            const address = addressResponse.address; //user wallet address for crypto instance
    
            //get icon for crypto instance
            var icon_url = `https://api.coingecko.com/api/v3/coins/${cr_info.crypto_name_market}`;
            var iconresquest = await fetch(icon_url,{
                method: "GET"
            }); 
            var iconresponse = await iconresquest.json();
            const icon = iconresponse.image.thumb;
    
            //crypto model objet for crypto instance
            const response = {
                id: cr_info.id,
                prefix : cr_info.prefix,
                crypto_name: cr_info.crypto_name,
                crypto_symbol: cr_info.crypto_symbol,
                crypto_type: cr_info.crypto_type,
                crypto_name_market: cr_info.crypto_name_market,
                stakable: cr_info.stakable,
                staking_amount_min: cr_info.staking_amount_min,
                available: cr_info.available,
                amount_min: cr_info.amount_min,
                sym_balance: balance,
                dollar_value: usd_value,
                wallet_address: address,
                image: icon
            }
    
            //return response
    
            res.status(200).json({
                status: 200,
                message: "crypto model get successfully!",
                data : response
            });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: "this crypto doesn't exist in the system",
                data : null
            });
        }
       
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: "unknown user",
            data : null
        });
    }
}

module.exports = {
    cryptoModel,
    cryptoModelStakable
}