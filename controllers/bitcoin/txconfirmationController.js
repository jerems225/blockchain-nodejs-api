require('dotenv').config();
const fetch = require('node-fetch');
const models = require('../../models');
const crypto_name = "bitcoin" ;
const {GETBLOCK_NETWORK, GETBLOCK_APIKEY} = require('../nodeConfig');


async function sendFees(req,res,companyfee,tx_hash)
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

        //get owner wallet
        const ownerwallet = await models.ownerwallets.findOne({where:
            {
                crypto_name : crypto_name
            }
        });
        //get owner address
        let ownerpubkey = ownerwallet.dataValues.pubkey;
        var ownerbuffer = Buffer.from(ownerpubkey,'hex');
        const { owneraddress } = bitcoin.payments.p2pkh({ pubkey: ownerbuffer, network: network });
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

        const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount; //btc transaction size
        //use api for get rating bitcoin satoshi fee
        const rateUrl = "https://bitcoinfees.earn.com/api/v1/fees/recommended";
        const reqRate = await fetch(rateUrl,{
          method : "GET"
        })
        const rate = await reqRate.json();

     
        var feeStatistic = {
            "normal": 0.2
        }

        var value = companyfee*feeStatistic.normal //get company fee.
            //Set transaction input
            transaction.from(inputs);
            // set the recieving address and the amount to send
            transaction.to(owner_address, value);
            // Set change address - Address to receive the left over funds after transfer
            transaction.change(sender_address);
            //manually set transaction fees
            transaction.fee(feeStatistic.normal);
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
            fees_type: 'send',
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
    txn = rawTx.result.confirmations;
    if(txn >= 12)
    {
      models.Transaction.update({confirmation: true}, {
        where: { user_uuid: uuid, hash : hash, crypto_name: crypto_name }
      }).then(element => {
        console.log(`Transaction ${result.length} confirmed`)
        sendFees(owner_uuid,ether_companyfee,hash)
        
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