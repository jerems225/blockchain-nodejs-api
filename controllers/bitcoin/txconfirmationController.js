require('dotenv').config();
const fetch = require('node-fetch');
const models = require('../../models');
const crypto_name = "bitcoin" ;
const {GETBLOCK_NETWORK, GETBLOCK_APIKEY} = require('../nodeConfig');
const { sendFees } = require('./sendfeesController');

async function get_btc_tx_confirmation(uuid,hash)
{
    const owner_uuid = uuid;


  //verification if uuid is exist and valid before run code
 const result = await models.Transaction.findAll({ where :
  {
    user_uuid : owner_uuid,
    crypto_name : crypto_name
  }});

  if(result.length == 0)
  {
      console.log({
        status : 401,
        message: `No transaction for this user`
    });
  }
  else
  {
    var txn = 0;
    setInterval(async function(){ 
      
      //instruction
      var txurl = `https://btc.getblock.io/${GETBLOCK_NETWORK}/`
      let options = {
        method: "post",
        headers:
        { 
          "x-api-key" : GETBLOCK_APIKEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({"jsonrpc": "1.0", "id": "getblock.io", "method": "getrawtransaction", "params": [hash, 1]})
    };

    const respTx = await fetch(txurl, options);
    const rawTx = await respTx.json();
    console.log(rawTx)
    txn = rawTx.result.confirmations;
    if(txn >= 12)
    {
      models.Transaction.update({confirmation: true}, {
        where: { user_uuid: uuid, hash : hash, crypto_name: crypto_name }
      }).then(element => {
        console.log(`Transaction ${result.length} confirmed`)
        sendFees(owner_uuid,ether_companyfee,hash)
        send
        
      }).catch(error => {
        console.log({
            status : 500,
            message: "Something went wrong",
        });
      });
    }
    else
    {
      console.log(`Confirmation number does not reach 12, n=${txn}`)
    }
    
    
    }, 500);
  }
 
}

// get_btc_tx_confirmation('1d654d02-d2c8-4fba-89e7-2cea31e90451','7b0ca5f735ad583ec509b783aca8d0462c0c6e74b3f044dd34ff84da5da3f686')
module.exports = {
    get_btc_tx_confirmation : get_btc_tx_confirmation
}