require('dotenv').config();
const fetch = require('node-fetch');
const models = require('../../../models');
const bitcoin = require('bitcoinjs-lib')
const { Address, PublicKey } = require('bitcore-lib');
const {BTC_NODE_NETWORK, BTC_NODE_NETWORK_CORE}= require('../../nodeConfig');

async function getBalance(crypto_name,req,res)
{

    const result = await models.ownerwallets.findOne({ where : 
        {
          crypto_name : crypto_name
        }});
  
        if(!result)
        {
          res.status(401).json({
            status : 401,
            message: `Unknown ${crypto_name} account for this user`
          });
        }
        else
        {
            let pubkey = result.dataValues.pubkey;
            var buffer = Buffer.from(pubkey,'hex');
            const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE});
            const url = "https://sochain.com/api/v2/get_tx_unspent/"+BTC_NODE_NETWORK+"/"+address
            const response = await fetch(url,{
                    method : "GET"
                }
            );
            const utxos = await response.json()

            console.log(utxos)
            let totalAmountAvailable = 0;
            let balance = 0.0;
            utxos.data.txs.forEach(async (element) => {
                let utxo = {};
                utxo.satoshis = Number(element.value);
                totalAmountAvailable += utxo.satoshis;
                if(totalAmountAvailable != 0)
                {
                    balance = totalAmountAvailable
                }
            });
            res.status(200).json({
              status : 200,
              message: `${crypto_name} account balance for this user`,
              balance : Number.parseFloat(balance).toPrecision()
            });
        }
}

module.exports = {
    getBalance
}