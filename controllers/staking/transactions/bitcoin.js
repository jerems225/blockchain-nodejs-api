require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bitcore = require('bitcore-lib');
const bitcoin = require('bitcoinjs-lib');
const models = require('../../../models');
const { BTC_NODE_NETWORK, GETBLOCK_NETWORK, GETBLOCK_APIKEY } = require('../../nodeConfig');
const txconfirmationController = require('../../bitcoin/txconfirmationController');


async function send(stakeobject,user_address,owner_address,user_privkey)
{
      const uuid = stakeobject.user_uuid;
      const value = stakeobject.amount_invest;
      const crypto_name = stakeobject.crypto_name;
      const spender_address = owner_address;
      const sender_address = user_address;
      const sender_privkey = user_privkey;
      const fee = stakeobject.fee_start;
      const transaction_type = "staking";
  
      const cryptoRequest = await models.Crypto.findOne({where:{
        crypto_name: crypto_name
      }})
  
      //crypto info
      const crypto = cryptoRequest.dataValues;
      const amount_min = crypto.amount_min;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
        var amount_usd;
        var fees_usd;
        const satoshiToSend = value * 100000000;



        if(value >= amount_min)
        {
            let inputCount = 0;
            let outputCount = 2;
            var btc_companyfee = null;
            var fees = fee * 100000000;

            // console.log(fees)
            // process.exit()

            //convert value ether to usd
            var urlbtc="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"; 
            var response_btc = await fetch(urlbtc,{method: "GET"});
            var result_btc = await response_btc.json(); 
            var btc_price = result_btc.bitcoin.usd;
            amount_usd = btc_price*Number(value);
            fees_usd = btc_price*fee;

            //get utox, unspent tx on node
            const url = "https://sochain.com/api/v2/get_tx_unspent/"+BTC_NODE_NETWORK+"/"+sender_address
            const resp = await fetch(url,{ method : "GET" });
            const utxos = await resp.json()
            // getUtxo.getUtxo(sender_address);
            const transaction = new bitcore.Transaction();
            var totalAmountAvailable = 0;
            let inputs = [];

            utxos.data.txs.forEach(async (element) => {
              let utxo = {};
              utxo.satoshis = Math.floor(Number(element.value) * 100000000);
              utxo.script = element.script_hex;
              utxo.address = utxos.data.address;
              utxo.txId = element.txid;
              utxo.outputIndex = element.output_no;
              totalAmountAvailable += utxo.satoshis;
              inputCount += 1;
              inputs.push(utxo);
            });
            // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte
            if (totalAmountAvailable - satoshiToSend - fees  < 0) {
                  var balance = 0;
                  if(totalAmountAvailable != 0)
                  {
                      balance = totalAmountAvailable/100000000;
                  }
                  console.log({
                    status : 401,
                    message: "Your balance is too low for this transaction",
                    balance : balance
                });
            }
            else
            {
                  //Set transaction input
                  transaction.from(inputs);
                  // set the recieving address and the amount to send
                  transaction.to("tb1qyk9zqyt5r4acqj9su7wcwuexqffnnh59cwe09l", satoshiToSend);
                  // Set change address - Address to receive the left over funds after transfer
                  transaction.change(sender_address);
                  //manually set transaction fees
                  transaction.fee(fees);
                  
                  // Sign transaction with your private key
                  transaction.sign(sender_privkey);
                  // serialize Transactions
                  const serializedTX = transaction.serialize();
                  let options = {
                    method: "post",
                    headers:
                    { 
                      "x-api-key" : GETBLOCK_APIKEY,
                      "content-type": "application/json"
                    },
                    body: JSON.stringify({
                      "jsonrpc": "2.0",
                      "method": "sendrawtransaction",
                      "params": [
                          serializedTX,
                          null
                      ],
                      "id": "getblock.io"
                  })
                };
                const respTx = await fetch(`https://btc.getblock.io/${GETBLOCK_NETWORK}/`, options);
                const sendTx = await respTx.json();
        
                const txObj = {
                  crypto_name: crypto_name,
                  transaction_type: transaction_type,
                  hash :  sendTx.result,
                  amount : value,
                  fees: fee,
                  amount_usd: amount_usd,
                  fees_usd: fees_usd,
                  amount_currency: null,
                  currency: null,
                  momo_method: null,
                  country: null,
                  from : sender_address,
                  to : spender_address,
                  paymentstatus: false,
                  confirmation: false,
                  user_uuid : uuid
              }
              //save in the database
              models.Transaction.create(txObj).then(result => {

                  txconfirmationController.get_btc_tx_confirmation(uuid,sendTx.result,btc_companyfee,transaction_type);
                    console.log({
                      status: 200,
                      message: `${crypto_name} sent to the staking pool successfully`,
                      datas: result
                  });
              }).catch(error => {
                console.log({
                      status : 500,
                      message: "Something went wrong",
                      error : error
                  });
              });
    
            }
        }
        else
        {
          console.log({
            status : 401,
            message: `You Need to provide More ${crypto_name} Value: value >= ${amount_min} ${crypto_name}`,
            data : {
                amount: Number(value)
            }
        });
        }

    }
    else{
      console.log({
        status : 401,
        message: `Unknown User`
    });
    }
}

module.exports = {
    send : send
}