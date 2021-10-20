require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bitcore = require('bitcore-lib');
const bitcoin = require('bitcoinjs-lib');
const models = require('../../models');
const { BTC_NODE_NETWORK, GETBLOCK_NETWORK, GETBLOCK_APIKEY } = require('../nodeConfig');
const txconfirmationController = require('./txconfirmationController');
const crypto_name = "bitcoin";
const amount_min = 0.001

// Network
if(NODE_ENV == 'test' ||'development')
{
  var network =  bitcoin.networks.testnet
}
else if(NODE_ENV == 'devprod')
{
  var network =  bitcoin.networks.bitcoin
}
else if(NODE_ENV == 'production')
{
  var network =  bitcoin.networks.bitcoin
}



async function estimatefees(req,res)
{
    const sender_uuid = req.query.uuid;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : sender_uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
        //generate address
        let pubkey = result.dataValues.pubkey;
        var buffer = Buffer.from(pubkey,'hex');
        const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: network });
        const sender_address = address;

        //simulate transaction
        let inputCount = 0;
        let outputCount = 2;
        //get utox, unspent tx on node
        const url = "https://sochain.com/api/v2/get_tx_unspent/"+BTC_NODE_NETWORK+"/"+sender_address
        const resp = await fetch(url,{ method : "GET" });
        const utxos = await resp.json()
        // getUtxo.getUtxo(sender_address);
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

        const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount; //btc transaction size
        //use api for get rating bitcoin satoshi fee
        const rateUrl = "https://bitcoinfees.earn.com/api/v1/fees/recommended";
        const reqRate = await fetch(rateUrl,{
          method : "GET"
        })
        const rate = await reqRate.json();
        const satoshi_const = 100000000;
        var feeStatistic = {
            "fastplus" : (rate.fastestFee*transactionSize + 15)/satoshi_const,
            "fast": (rate.halfHourFee*transactionSize)/satoshi_const,
            "medium": (rate.hourFee*transactionSize)/satoshi_const, 
            "normal": (rate.hourFee*transactionSize - 20)/satoshi_const
        }
        
        res.status(200).json({
            status : 200,
            message: "Fees Managment Get With Success",
            data : feeStatistic
        });
    }
    else{
        res.status(401).json({
            status : 401,
            message: "Unknown User",
            data : null
        });
    }
}

async function sendTransaction(req,res)
{
      const sender_uuid = req.query.uuid;
      const transaction_type = req.params.txtype;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : sender_uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
          //generate address
          let pubkey = result.dataValues.pubkey;
          var buffer = Buffer.from(pubkey,'hex');
          const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: network });
          const sender_address = address;
          
          const sender_privkey = result.dataValues.privkey;
          const spender_address = req.query.to;
          const value = req.query.value; //need to be multiply by 100,000,000 of satoshi

      //call function for company fees : getFee()

        const satoshiToSend = value * 100000000;

        if(value >= amount_min)
        {
            let fee = req.query.txfee; 
            let inputCount = 0;
            let outputCount = 2;
            var btc_companyfee = req.query.companyfee;

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
                  fees: fee,
                  from : sender_address,
                  to : spender_address,
                  confirmation: false,
                  user_uuid : sender_uuid
              }
              //save in the database
              models.Transaction.create(txObj).then(result => {

                  //call confirmation function
                  txconfirmationController.get_btc_tx_confirmation(sender_uuid,sendTx.result,btc_companyfee);
                  res.status(200).json({
                      status: 200,
                      message: "Transaction created successfully",
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
    sendTransaction : sendTransaction,
    estimatefees : estimatefees
}