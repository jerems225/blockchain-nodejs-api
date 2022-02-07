require('dotenv').config();
const fetch = require('node-fetch')
const { GETBLOCK_NETWORK,GETBLOCK_APIKEY,BTC_NODE_NETWORK_CORE } = require('../nodeConfig');
const models = require('../../models');
const bitcoin = require('bitcoinjs-lib')
const crypto_name = "bitcoin" ;


async function get_btc_tx_new()
{
      try
      {
        const result = await models.Wallet.findAll({ where :
          {
            blockchain : 'bitcoin'
          }});

      if(result.length != 0)
      {
        setInterval(async function(){ 
        for(var data=0;data<=result.length -1;data++)
        {
              
              //get Mempool 
              var mempoolurl = `https://btc.getblock.io/${GETBLOCK_NETWORK}/`
              let optionsmempool = {
                method: "post",
                headers:
                { 
                  "x-api-key" : GETBLOCK_APIKEY,
                  "content-type": "application/json"
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "getrawmempool",
                    "params": [
                        null,
                        null
                    ],
                    "id": "getblock.io"
                })
            };
            const respMempool = await fetch(mempoolurl, optionsmempool);
            const Mempool = await respMempool.json();
            var MempoolTxid = Mempool.result;
            for(var i=0;i<=MempoolTxid.length -1 ;i++) 
            {
                  //get raw transaction
                  var txurl = `https://btc.getblock.io/${GETBLOCK_NETWORK}/`
                  let options = {
                      method: "post",
                      headers:
                      { 
                      "x-api-key" : GETBLOCK_APIKEY,
                      "content-type": "application/json"
                      },
                      body: JSON.stringify({"jsonrpc": "1.0", "id": "getblock.io", "method": "getrawtransaction", "params": [MempoolTxid[i], 1]})
                  };

                  const respTx = await fetch(txurl, options);
                  const rawTx = await respTx.json();
                  var addr = rawTx.result.vout[0].scriptPubKey.addresses;

                  //get user address
                  let pubkey = result[data].pubkey;
                  var buffer = Buffer.from(pubkey,'hex');
                  const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE});
                  var user_address = address;
                  console.log("Websocket New Tx Bitcoin Running...")

                    if(addr == user_address)
                    {
                      var txn = rawTx.result.confirmations;
                      if(txn>=12)
                      {
                          txObj = {
                            transaction_type: "received",
                            crypto_name: crypto_name,
                            hash: rawTx.result.txid,
                            from: "N/A",
                            to: user_address,
                            fees: "N/A",
                            confirmation: true,
                            amount: rawTx.result.vout[0].value,
                            user_uuid : result[data].user_uuid
                        };
                        // save the receive transaction in the database
                        const exist = await models.Transaction.findOne({ where :
                          {
                            hash : rawTx.result.txid
                          }});
                          if(!exist)
                          {
                              models.Transaction.create(txObj).then(result => {
                                console.log({
                                  status:201,
                                  message:  `your received a new ${crypto_name} transaction`,
                                  data: result
                                })
                              }).catch(error => {
                                  console(error)
                              });

                              console.log("new transaction",rawTx.result)
                          }
                      }
                    }
            }
        }
      }, 3000);
      }

      }
      catch(error)
      {
        console.error(error)
      }
 }


module.exports = {
    get_btc_tx_new : get_btc_tx_new
}