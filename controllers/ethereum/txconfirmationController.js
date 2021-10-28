require('dotenv').config();
const { ETH_NODE_WS,ETH_NODE_URL } = require('../nodeConfig');
const fetch = require('node-fetch');
const models = require('../../models');
var Web3 = require('web3');
var exec = false;
const crypto_name = "ethereum" ;

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


async function sendFees(sender_uuid,companyfee,tx_hash,tx_type)
{
  const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
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
    var urlgasp = "https://ethgasstation.info/api/ethgasAPI.json?";
    var resp = await fetch(urlgasp,{method: "GET"});
    var resjson = await resp.json();
    const gas = 21000;
    //get txfee in gwei
    const txfee = gas*(resjson.safeLow/10);
    //get fee value
    const txfee_ether = await web3.utils.fromWei(web3.utils.toWei(txfee.toString(),'gwei'),'ether')
    var value = Number(companyfee) - Number(txfee_ether);
            setTimeout(async function txF()
            {
                
                  const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
                    const transaction = {
                    'to': "0xcbe68f0486A369b37d99E4BEfF35B0Ca83062542", //owner_address
                    'value': web3.utils.toWei(value.toFixed(6),'ether'), 
                    'gas': txfee, 
                    'nonce': nonce +1,
                    'gasLimit': web3.utils.toHex(gas)
                    // optional data field to send message or execute smart contract
                        };
                    const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_privkey);
                        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
                            if (!error) {
                                const txObj = {
                                    fees_type: 'send',
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
                    }
            , 10000);
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



async function get_eth_tx_confirmation(uuid,ether_companyfee)
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
    var web3 = new Web3(new Web3.providers.WebsocketProvider(ETH_NODE_WS, options));
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
                                  console.log(`Transaction ${result.length} confirmed`)
                                  if(exec == false)
                                  {
                                    console.log(exec);
                                    exec = true;
                                    sendFees(owner_uuid,ether_companyfee,tx.hash); //send company fees function

                                  }
                                }).catch(error => {
                                  console.log({
                                      status : 500,
                                      message: "Something went wrong",
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
    get_eth_tx_confirmation : get_eth_tx_confirmation
}