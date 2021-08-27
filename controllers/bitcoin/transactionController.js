require('dotenv').config();
const fetch = require('node-fetch');
const axios = require('axios');
const { BTC_NODE_NETWORK } = process.env;
const bitcore = require('bitcore-lib');
const bitcoin = require('bitcoinjs-lib');
const models = require('../../models');
const crypto_name = "bitcoin";


async function sendTransaction(req,res){

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
          const sender_pubkey = result.dataValues.pubkey;
          const buffer = Buffer.from(sender_pubkey,'hex');
          const { sender_address } = bitcoin.payments.p2pkh({pubkey: buffer})

          
          const sender_privkey = result.dataValues.privkey;
          const spender_address = req.query.to;
          const value = req.query.value; //need to be multiply by 100,000,000 of satoshi


      //call function for company fees : getFee()

        const satoshiToSend = value * 100000000;
        let fee = 300; 
        let inputCount = 0;
        let outputCount = 2;
        const utxos = await axios.get(
          `https://sochain.com/api/v2/get_tx_unspent/${BTC_NODE_NETWORK}/${sender_address}`
        );


        const transaction = new bitcore.Transaction();
        let totalAmountAvailable = 0;

        let inputs = [];
        utxos.data.data.txs.forEach(async (element) => {
          let utxo = {};
          utxo.satoshis = Math.floor(Number(element.value) * 100000000);
          utxo.script = element.script_hex;
          utxo.address = utxos.data.data.address;
          utxo.txId = element.txid;
          utxo.outputIndex = element.output_no;
          totalAmountAvailable += utxo.satoshis;
          inputCount += 1;
          inputs.push(utxo);
        });

        transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
        // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte

        fee = transactionSize
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

          //manually set transaction fees: 20 satoshis per byte
          transaction.fee(fee * 20);

          // Sign transaction with your private key
          transaction.sign(sender_privkey);

          // serialize Transactions
          const serializedTX = transaction.serialize();
          // Send transaction
          const result = await axios({
                      method: "POST",
                      url: `https://sochain.com/api/v2/send_tx/${BTC_NODE_NETWORK}`,
                      data: {
                      tx_hex: serializedTX,
                      },
                  });

                  var datas  = result.data;

                  const txObj = {
                    crypto_name: crypto_name,
                    transaction_type: transaction_type,
                    hash :  datas.data.txid,
                    amount : value,
                    from : sender_address,
                    to : spender_address,
                    confirmation: false,
                    user_uuid : sender_uuid
                }
                
                    //save in the database
                models.Transaction.create(txObj).then(result => {
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
          

          //save the transaction information with date and by user on the database
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
    sendTransaction : sendTransaction
}