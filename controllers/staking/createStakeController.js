require('dotenv').config();
const {BASE_IP} = process.env;
const fetch = require('node-fetch');
const bitcoin = require('bitcoinjs-lib');
const models = require('../../models');
const { BTC_NODE_NETWORK_CORE,BTC_NODE_NETWORK, GETBLOCK_NETWORK, GETBLOCK_APIKEY } = require('../nodeConfig');

const bitcoinTransaction = require('./transactions/bitcoin');
const ethereumTransaction = require('./transactions/ethereum');
const binanceTransaction = require('./transactions/binance');
const tokenTransaction = require('./transactions/token');
const bsctokenTransaction = require('./transactions/bsctokens');
const { id } = require('date-fns/locale');

async function createStake(req,res)
{
    const body = req.body;
    const uuid = body.uuid;
    const crypto_name  = body.crypto_name;
    const amount_invest = body.amount_invest;
    const day = body.day;//the period choose by the user
    const auto_renew = body.auto_renew;

    const userRequest = await models.user.findOne({where :{
        uuid : uuid
    }});

    if(userRequest)
    {
        //get crypto info
        const cryptoRequest = await models.Crypto.findOne({where: {
            crypto_name : crypto_name
        }})
        const crypto = cryptoRequest.dataValues;
        const staking_amount_min = crypto.staking_amount_min;
        const crypto_blockchain = crypto.blockchain;
        const crypto_prefix = crypto.prefix;
        const crypto_symbol = crypto.symbol;

        //get user wallet info
        const walletRequest = await models.Wallet.findOne({where : {
            user_uuid : uuid,
            crypto_name :crypto_name
        }});
        const wallet = walletRequest.dataValues;
        var user_address;
        const user_pubkey = wallet.pubkey; //stakeholder address
        const user_privkey = wallet.privkey; //stakeholder priv key

        //get owner wallet info
        const OwnerRequest = await models.ownerstakewallet.findOne({where : {
            crypto_name :crypto_name
        }});
        const ownerwallet = OwnerRequest.dataValues;
        const owner_pubkey = ownerwallet.pubkey;
        var owner_address;

        //get ownerstake and user wallet info
        if(crypto_name == "bitcoin")
        {
            //owner_stake
            var btcurl = `https://${BASE_IP}/btc/owner/getaddress/stake`
            var btcreq = await fetch(btcurl,{
                method: "GET"
            });
            var btcres = await btcreq.json();
            owner_address = btcres.address;

            //user_stake
            var buffer = Buffer.from(user_pubkey,'hex');
            const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE });
            user_address = address
        }
        else{
            owner_address = owner_pubkey
            user_address = user_pubkey
        }

        if(amount_invest > staking_amount_min)
        {
        
            const rates = crypto.rates;
            const days = crypto.days;
            var rate;

            //get rate
            for(var e=0;e<days.length;e++)
            {
                if(days[e] == day)
                {
                    rate = rates[e]*0.01;
                }
            }

            //get amount_reward and amount_reward_day
            var amount_reward = amount_invest*rate;
            var amount_reward_day = amount_reward/day;

            //get fee_start, all estimatefees endpoint, fee_start = fee_end
            var fee_start;
            var urlfee;
            var feeReq;
            var feeRes;
            if(crypto_blockchain == "bitcoin")
            {
                urlfee = `https://${BASE_IP}/btc/estimatefees?uuid=${uuid}`;
                feeReq = await fetch(urlfee,{
                    method:"POST"
                });
                feeRes = await feeReq.json();
                fee_start = feeRes.data.normal/2;
            }
            else if(crypto_blockchain == "ethereum"){
                urlfee = `https://${BASE_IP}/eth/estimatefees?uuid=${uuid}`;
                feeReq = await fetch(urlfee,{
                    method:"POST"
                });
                feeRes = await feeReq.json();
                fee_start = feeRes.data.normal/2;
            }
            else if(crypto_blockchain == "binance"){
                urlfee = `https://${BASE_IP}/${crypto_prefix}/${crypto_symbol}/estimatefees?uuid=${uuid}`;
                feeReq = await fetch(urlfee,{
                    method:"POST"
                });
                feeRes = await feeReq.json();
                fee_start = feeRes.data.normal/2;
            }

            
            //store request
            const stakeobject = {
                crypto_name: crypto_name,
                user_uuid: uuid,
                amount_invest: amount_invest,
                amount_reward : amount_reward,
                amount_reward_day: amount_reward_day,
                period : day,
                rate : rate,
                start_status: true,
                reward_return_status: false,
                start_time: null,//wait for tx_stake_confirm : true
                end_time: null,
                fee_start : fee_start,
                fee_end: fee_start,
                end_status: false,
                auto_renew : auto_renew,
                tx_stake_confirm: false
            }

            const tx_info = {
                user_address : user_address,
                user_privkey : user_privkey,
                owner_address : owner_address
            }

            //store stakeholder request
            models.stakeholder.create(stakeobject).then(result => {
                //send transaction to owner
                if(crypto_name == "bitcoin")
                {
                    bitcoinTransaction.send(stakeobject,tx_info,day);
                }
                else if(crypto_name == "ethereum")
                {
                    ethereumTransaction.send(stakeobject,tx_info,day);
                }
                else if(crypto_name == "binance")
                {
                    binanceTransaction.send(stakeobject,tx_info,day)
                }
                else
                {
                    if(blockchain == "ethereum")
                    {
                        tokenTransaction.send(stakeobject,tx_info,day);
                    }
                    else if(blockchain == "binance")
                    {
                        bsctokenTransaction.send(stakeobject,tx_info,day);
                    }
                    tokenTransaction.send(stakeobject,tx_info,day);
                }
                res.status(200).json({
                    status : 200,
                    message: `${crypto_name} sent to the staking pool successfully`,
                    data : stakeobject
                });
            }).catch(error => {
                res.status(500).json({
                    status : 500,
                    message: "Something went wrong",
                    error : error
                });
            });
        }
        else{
            //provide a value into staking_amount_min and staking_amount_max
            res.status(401).json({
                status: 401,
                message: `provide a value superior to ${staking_amount_min}`,
                data : 
                {
                    crypto_name : crypto_name,
                    amount_invest : amount_invest,
                    staking_amount_min : staking_amount_min
                }
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
    createStake : createStake
}