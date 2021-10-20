require('dotenv').config();
const fetch = require('node-fetch');
const { ETH_NODE_URL } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const crypto_name = 'ethereum';

async function sendFees(sender_uuid,companyfee,tx_hash,tx_type)
{
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

    var urlgasp = "https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=2b4bba96421133c2a5155278a6a0f289c68928714bbdee3e8f8be0e7b2cd";
    var resp = await fetch(urlgasp,{method: "GET"});
    var resjson = await resp.json();
    const gas = 21000;

    //get txfee in gwei
    const txfee = gas*(resjson.safeLow/10);

    //get fee value
    const txfee_ether = await web3.utils.fromWei(web3.utils.toWei(txfee.toString(),'gwei'),'ether')


    const companyfee_wei = await web3.utils.toWei(companyfee,'ether')
    var value = Number(companyfee) - Number(txfee_ether);
    
    // console.log(`user balance: ${user_balance} txfee: ${txfee_ether}\n companyfee: ${companyfee}\n value: ${value}`)


        //get owner wallet
        const exist = await models.CompanyFees.findAll({where:
            {
                tx_hash : tx_hash
            }
        });

        if(exist.length == 0)
        {
           
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
                    if(exist.length == 0)
                    {
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

            }
            , 5000);
            
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
}

module.exports = {
    sendFees : sendFees
}