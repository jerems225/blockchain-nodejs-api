require('dotenv').config();
const fetch = require('node-fetch');
const axios = require('axios');
const { URL_UTOX_BTC,API_KEY, PRIVATE_KEY_BTC} = process.env;
const bitcore = require('bitcore-lib');


async function sendTransaction(req,res){

    const sender_address = req.query.from;
    const spender_address = req.query.to;
    const value = req.query.value; //need to be multiply by 100,000,000 of satoshi
    const sochain_network = "BTCTEST";


//call function for company fees : getFee()

  const satoshiToSend = value * 100000000;
  let fee = 300; 
  let inputCount = 0;
  let outputCount = 2;
  const utxos = await axios.get(
    `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sender_address}`
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

  fee = transactionSize * 20
  if (totalAmountAvailable - satoshiToSend - fee  < 0) {

    var balance = 0;

    if(totalAmountAvailable != 0)
    {
        balance = totalAmountAvailable/100000000;
    }

    res.send({
        'result':
         {
            'errmsg' : "Your balance is too low for this transaction",
            'balance': balance
        }
    })
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
    transaction.sign(PRIVATE_KEY_BTC);

    // serialize Transactions
    const serializedTX = transaction.serialize();
    // Send transaction
    const result = await axios({
                method: "POST",
                url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
                data: {
                tx_hex: serializedTX,
                },
            });

    res.send({
        'result' : result.data.data
    })

    //save the transaction information with date and by user on the database
 }

}


module.exports = {
    sendTransaction : sendTransaction
}