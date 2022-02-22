require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bitcore = require('bitcore-lib');
const bitcoin = require('bitcoinjs-lib');
const models = require('../../models');
const { BTC_NODE_NETWORK_CORE,BTC_NODE_NETWORK, GETBLOCK_NETWORK, GETBLOCK_APIKEY } = require('../nodeConfig');
const txconfirmationController = require('./txconfirmationController');
const crypto_name = "bitcoin";


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
        const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE });
        const sender_address = address;
        const amount = Number(req.query.value);

        //simulate transaction
        let inputCount = 0;
        let outputCount = 2;
        //get utox, unspent tx on node
        const url = "https://sochain.com/api/v2/get_tx_unspent/"+BTC_NODE_NETWORK+"/"+sender_address
        const resp = await fetch(url,{ method : "GET" });
        const utxos = await resp.json()
        // getUtxo.getUtxo(sender_address);
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

        const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount; //btc transaction size
        //use api for get rating bitcoin satoshi fee
        const rateUrl = "https://bitcoinfees.earn.com/api/v1/fees/recommended";
        const reqRate = await fetch(rateUrl,{
          method : "GET"
        })
        const rate = await reqRate.json();

        //satoshi add by level of amount
        var rateNeed = 4;
        // if(amount >= 0.001  && amount < 0.002)
        // {
        //   rateNeed = 15000
        // }
        // if(amount >= 0.002  && amount < 0.003)
        // {
        //   rateNeed = 20000
        // }

        const satoshi_const = 100000000;
        var feeStatistic = {
            "fastplus" : ((rate.fastestFee*transactionSize + 1500)*rateNeed)/satoshi_const,
            "fast": ((rate.halfHourFee*transactionSize + 1000)*rateNeed)/satoshi_const,
            "medium": ((rate.hourFee*transactionSize + 500)*rateNeed)/satoshi_const, 
            "normal": ((rate.hourFee*transactionSize + 250)*rateNeed - 20)/satoshi_const
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
          const sender_privkey = result.dataValues.privkey;
          var spender_address = req.query.to;
          const value = req.query.value; //need to be multiply by 100,000,000 of satoshi
          var momo_method;
          var currency;
          var amount_usd;
          var amount_currency;
          var fees_usd;
          var rate;
          var country;
          var phone;

        //get owner wallet
          const ownerwallet = await models.ownerwallets.findOne({where:
            {
                crypto_name : crypto_name
            }
          });
      
        if(transaction_type == "send")
        {
            spender_address = req.query.to; //spender address
        }
        else
        {
            if(transaction_type == "withdraw")
            {
                pubkey = ownerwallet.dataValues.pubkey; //owner wallet address
                momo_method = req.query.momo_method;
                currency = req.query.currency;
                country = req.query.country;
                phone = req.query.phone;
                const rateResponse = await models.rate.findOne({where: {
                    currency: currency
                }})
                rate = rateResponse.dataValues.value_sell;
            }
        }

        //address  bitcoin
        var buffer = Buffer.from(pubkey,'hex');
        const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE });
        const sender_address = address;

      //call function for company fees : getFee()

        const satoshiToSend = value * 100000000;

      const cryptoRequest = await models.Crypto.findOne({where:{
          crypto_name: crypto_name
      }})

      //crypto info
      const crypto = cryptoRequest.dataValues;
      const amount_min = crypto.amount_min;

        if(value >= amount_min)
        {
            let fee = req.query.txfee; 
            let inputCount = 0;
            let outputCount = 2;
            var btc_companyfee = req.query.companyfee;
            var fees = Number(fee) + Number(btc_companyfee);

            //convert value ether to usd
            var urlbtc="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"; 
            var response_btc = await fetch(urlbtc,{method: "GET"});
            var result_btc = await response_btc.json(); 
            var btc_price = result_btc.bitcoin.usd;
            amount_usd = btc_price*Number(value);
            fees_usd = result_btc.bitcoin.usd*fee;

            if(transaction_type == "withdraw")
            {
              amount_currency = rate*amount_usd;
            }

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
            if (totalAmountAvailable - satoshiToSend - fees  < 0) {
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
                  transaction.fee(fee* 100000000);
                  
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
                  amountcurrency: amount_currency,
                  currency: currency,
                  momo_method: momo_method,
                  phone : phone,
                  from : sender_address,
                  to : spender_address,
                  confirmation: false,
                  user_uuid : sender_uuid
              }
              //save in the database
              models.Transaction.create(txObj).then(result => {

                  //call confirmation function
                  var tx_hash = sendTx.result;
                  txconfirmationController.get_btc_tx_confirmation(sender_uuid,tx_hash,btc_companyfee,transaction_type);
                  if(transaction_type == "send" || transaction_type == "withdraw")
                  {
                    res.status(200).json({
                      status: 200,
                      message: "Transaction created successfully",
                      datas: result
                  });
                  }

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