require('dotenv').config();
const fetch = require('node-fetch');
const models = require('../../models');
const { createPayment } = require('../momo/withdrawController');
const crypto_name = "bitcoin" ;
const datefns = require("date-fns");
const {BTC_NODE_NETWORK_CORE,GETBLOCK_NETWORK, GETBLOCK_APIKEY} = require('../nodeConfig');
const { sendblockchainfees } = require('../blockchainfees/sendblockchainfee');


async function sendFees(sender_uuid,tx_hash,companyfee,transaction_type)
{
    // const sender_uuid = req.query.uuid;

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

        //get owner wallet
        const ownerwallet = await models.ownerwallets.findOne({where:
            {
                crypto_name : crypto_name
            }
        });
        //get owner address
        let ownerpubkey = ownerwallet.dataValues.pubkey;
        var ownerbuffer = Buffer.from(ownerpubkey,'hex');
        const { owneraddress } = bitcoin.payments.p2pkh({ pubkey: ownerbuffer, network: BTC_NODE_NETWORK_CORE });
        const owner_address = owneraddress;

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

        var value = Number(companyfee)*100000000 - 180  //get company fee.
            //Set transaction input
            transaction.from(inputs);
            // set the recieving address and the amount to send
            transaction.to(owner_address, value);
            // Set change address - Address to receive the left over funds after transfer
            transaction.change(sender_address);
            //manually set transaction fees
            transaction.fee(180);
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
            fees_type: transaction_type,
            crypto_name: crypto_name,
            hash :  sendTx.result,
            tx_hash: tx_hash,
            amount : value,
            from : sender_address,
            to : owner_address,
        }
        //save in the database
        models.CompanyFees.create(txObj).then(result => {
            console.log({
                status : 200,
                message: `Company fees saved successfully`,
                data : result
            });
            sendblockchainfees(sender_uuid,"bitcoin");
            process.exit()
        }).catch(error => {
            console.log({
                status : 500,
                message: "Something went wrong",
                data: {
                    error : error
                } 
            });
        });
        console.log({
            status: 200,
            message : 'Company Fees Send With Success'
        })

    } 
    else{
        res.status(401).json({
            status : 401,
            message: "Unknown User",
            data : null
        });
    }
}


async function get_btc_tx_confirmation(uuid,hash,btc_companyfee,transaction_type,day)
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
    txn = rawTx.result.confirmations;
    
    if(txn >= 12)
    {
      models.Transaction.update({confirmation: true}, {
        where: { user_uuid: uuid, hash : hash, crypto_name: crypto_name }
      }).then(element => {
        console.log(`Transaction ${result.length} confirmed`)
        if(transaction_type == "send" || transaction_type == "withdraw")
        {
          //call withdraw syntaxt if transaction_type == withdraw
          if(transaction_type == "withdraw")
          {
            createPayment(tx_hash);
          }
          sendFees(owner_uuid,btc_companyfee,hash,transaction_type)
        }
        else
        {
          if(transaction_type == "staking")
          {
           //get start_time et and end_time
            var start_time = new Date(Date.now());
            var end_time = datefns.addDays(start_time,day) //add period day choose by the user on  //date.toLocaleString("en-US", {timeZone: "America/New_York"});
                    //the start_time, start_time is the current time of request
            models.stakeholder.update({start_time: start_time,end_time: end_time,tx_stake_confirm : true},{where:{
              crypto_name : crypto_name,
              user_uuid : owner_uuid,
              tx_stake_confirm: false
            }}).then(result1 =>{console.log("upadate stakeholder instance: " ,result1)});

            models.user.update({isHolder : true},{where: {
              uuid:owner_uuid
            }}).then(result2 => {console.log("upadate user_isholder: " ,result2)});
          }
          process.exit();
        }
        
        
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

module.exports = {
    get_btc_tx_confirmation : get_btc_tx_confirmation
}