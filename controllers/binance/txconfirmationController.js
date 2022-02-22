require('dotenv').config();
const { BSC_NODE_WS,BSC_NODE_URL, CHAIN_ID } = require('../nodeConfig');
const fetch = require('node-fetch');
const models = require('../../models');
var Web3 = require('web3');
const { createPayment } = require('../momo/withdrawController');
const datefns = require("date-fns");
const { sendblockchainfees } = require('../blockchainfees/sendblockchainfee');
var exec = false;
const crypto_name = "binance" ;

var options = {
  timeout: 30000,
  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  },
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 15,
    onTimeout: false,
  },
};


async function sendFees(sender_uuid,companyfee,tx_hash,transaction_type)
{
  const provider = new Web3.providers.HttpProvider(BSC_NODE_URL);
  const web3 = new Web3(provider);
// verification if uuid is exist and valid before run code
 const result = await models.Wallet.findOne({ where :
  {
    user_uuid : sender_uuid,
    crypto_name: crypto_name
  }});

  if(result)
  {
    //get sender informations
    var sender_address = result.dataValues.pubkey;
    var sender_privkey = result.dataValues.privkey;
    //get owner wallet
    const ownerwallet = await models.ownerwallets.findOne({where:
        {
            crypto_name : crypto_name
        }
    });
    //get owner address
    const owner_address = ownerwallet.dataValues.pubkey;
    const gas = 21000;
    //get txfee in gwei
    const txfee = gas;
    //get fee value
    const txfee_ether = await web3.utils.fromWei(await web3.utils.toWei(txfee.toString(),'gwei'),'ether')
    var value = Number(companyfee) - Number(txfee_ether);

    setTimeout(async function txF()
    {
      const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
      const newnonce = nonce + 1;
        const transaction = {
        'to': owner_address, //owner_address
        'value': web3.utils.toWei(value.toString(),'ether'), 
        'gas': txfee, 
        'nonce': newnonce ,
        'gasLimit': web3.utils.toHex(gas),
        'chainId': CHAIN_ID
        // optional data field to send message or execute smart contract
            };
        const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_privkey);
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
                if (!error) {
                    const txObj = {
                        fees_type: transaction_type,
                        crypto_name: crypto_name,
                        hash :  hash,
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
                        sendblockchainfees(sender_uuid,"binance");
                        process.exit()
                    }).catch(error => {
                        console.log({
                            status : 500,
                            message: "Something went wrong line 102",
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
                else {
                    console.log({
                        status : 500,
                        message: "Transaction Not Send yet! Please Try Again",
                        data : {
                            error: error
                        }
                    });
                }
                });
        }, 15000);
  }
  else
  {
      console.log({
          status : 500,
          message: "Something went wrong",
            data: null
      });
  }
}



async function get_bsc_tx_confirmation(uuid,ether_companyfee,transaction_type,day)
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
    var web3 = new Web3(new Web3.providers.WebsocketProvider(BSC_NODE_WS, options));
    const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
      if (err) console.error(err);
    });
    
   let tx;
   let receipt;
    subscription.on("data", () => {
      setTimeout(async () => {
          result.map((item) => {
            web3.eth.getTransaction(item.hash,function(error, data)
            {
              tx = data;
              if (tx != null)
                {
                    if(tx.hash == item.hash)
                    {
                        web3.eth.getTransactionReceipt(item.hash,function(error, data) {
                          receipt = data;
                          if(receipt != null)
                        {
                              var n =0;
                              if(receipt.status && n == 0)
                              {
                                models.Transaction.update({confirmation: receipt.status}, {
                                  where: { user_uuid: item.user_uuid, hash : tx.hash, crypto_name: crypto_name }
                                }).then(element => {
                                  console.log(`Transaction ${result.length} confirmed`);
                                    if(transaction_type == "send" || transaction_type == "withdraw")
                                    {
                                      //call withdraw syntaxt if transaction_type == withdraw
                                      if(transaction_type == "withdraw")
                                      {
                                        createPayment(tx.hash);
                                      }
                                      sendFees(owner_uuid,ether_companyfee,tx.hash,transaction_type); //send company fees function
                                    }
                                    else if(transaction_type == "staking"){

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
                                            uuid : owner_uuid
                                          }}).then(result2 => {console.log("update user_isholder: " ,result2)});
                                      // process.exit()
                                    }
                                    
                                }).catch(error => {
                                  console.log({
                                      status : 500,
                                      message: "Something went wrong",
                                      data : error
                                  });
                                });
                                 n = 1;
                              }
                        }
                        })
                    }
                }
            }) 
            });
            
      });
      
    });
  }
    
}

module.exports = {
    get_bsc_tx_confirmation : get_bsc_tx_confirmation
}