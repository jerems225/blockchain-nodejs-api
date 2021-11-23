require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bitcore = require('bitcore-lib');
const bitcoin = require('bitcoinjs-lib');
const models = require('../../models');
const { BTC_NODE_NETWORK_CORE,BTC_NODE_NETWORK, GETBLOCK_NETWORK, GETBLOCK_APIKEY } = require('../nodeConfig');
const txconfirmationController = require('../bitcoin/txconfirmationController');


async function send(res,uuid,value,txfee,txtype,crypto_name,momo_method,currency,country,status,rate)
{
    const sender_uuid = uuid;
      const transaction_type = txtype;

      var amount_min;
      var crypto_name;
  
      const cryptoRequest = await models.Crypto.findOne({where:{
        crypto_name: crypto_name
      }})
  
      //crypto info
      const crypto = cryptoRequest.dataValues;
      var amount_min = crypto.amount_min;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : sender_uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
          //generate address
          let spender_pubkey = result.dataValues.pubkey;
          //address  bitcoin receiver
          var spender_buffer = Buffer.from(spender_pubkey,'hex');
          const { address } = bitcoin.payments.p2pkh({ pubkey: spender_buffer, network: BTC_NODE_NETWORK_CORE });
          const spender_address = address;

          //address bitcoin sender/owner
          //get owner wallet
          const ownerwallet = await models.ownerwallets.findOne({where:
            {
                crypto_name : crypto_name
            }
          });
          let sender_pubkey = ownerwallet.dataValues.pubkey;
          var sender_buffer = Buffer.from(sender_pubkey,'hex');
          const { owner_address } = bitcoin.payments.p2pkh({ pubkey: sender_buffer, network: BTC_NODE_NETWORK_CORE }); //check
          const sender_address = owner_address;
          const sender_privkey = ownerwallet.dataValues.privkey

          var amount_usd;
          var amount_currency;
          var fees_usd;

          const rateResponse = models.rate.findOne({where: {
            currency: currency
          }})
          var rate = rateResponse.dataValues.value;
          var country = country;


      //call function for company fees : getFee()

        const satoshiToSend = value * 100000000;

        if(value >= amount_min)
        {
            let fee = txfee; 
            let inputCount = 0;
            let outputCount = 2;
            var fees = Number(fee);
            var btc_companyfee = null;

            //convert value ether to usd
            var urlbtc="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"; 
            var response_btc = await fetch(urlbtc,{method: "GET"});
            var result_btc = await response_btc.json(); 
            var btc_price = result_btc.bitcoin.usd;
            amount_usd = btc_price*Number(value);
            fees_usd = btc_price.bitcoin.usd*fees;
            amount_currency = rate*amount_usd;

            //get utox, unspent tx on node
            const url = "https://sochain.com/api/v2/get_tx_unspent/"+BTC_NODE_NETWORK+"/"+sender_address
            const resp = await fetch(url,{ method : "GET" });
            const utxos = await resp.json()
            // getUtxo.getUtxo(sender_address);
            const transaction = new bitcore.Transaction();
            let totalAmountAvailable = 0;
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
            if (totalAmountAvailable - satoshiToSend - fee  < 0) {
                  var balance = 0;
                  if(totalAmountAvailable != 0)
                  {
                      balance = totalAmountAvailable/100000000;
                  }
                  res.status(401).json({
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
                  transaction.to(spender_address, satoshiToSend);
                  // Set change address - Address to receive the left over funds after transfer
                  transaction.change(sender_address);
                  //manually set transaction fees
                  transaction.fee(fee);
                  
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
                  fees: fees,
                  amount_usd: amount_usd,
                  fees_usd: fees_usd,
                  amount_currency: amount_currency,
                  currency: currency,
                  momo_method: momo_method,
                  country: country,
                  from : sender_address,
                  to : spender_address,
                  paymentstatus: status,
                  confirmation: false,
                  user_uuid : sender_uuid
              }
              //save in the database
              models.Transaction.create(txObj).then(result => {

                  //call confirmation function
                  txconfirmationController.get_btc_tx_confirmation(sender_uuid,sendTx.result,btc_companyfee,transaction_type);
                    res.status(200).json({
                      status: 200,
                      message: `${crypto_name} sent to the user successfully`,
                      datas: result
                  });
                  process.exit();
              }).catch(error => {
                  res.status(500).json({
                      status : 500,
                      message: "Something went wrong",
                      error : error
                  });
              });
    
            }
        }
        else
        {
          res.status(401).json({
            status : 401,
            message: `You Need to provide More ${crypto_name} Value: value >= ${amount_min} ${crypto_name}`,
            data : {
                amount: Number(value)
            }
        });
        }

    }
    else{
      res.status(401).json({
        status : 401,
        message: `Unknown User`
    });
    }
}

module.exports = {
    send : send
}