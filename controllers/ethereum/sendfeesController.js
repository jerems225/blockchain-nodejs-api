require('dotenv').config();
const fetch = require('node-fetch');
const { ETH_NODE_URL } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const crypto_name = 'ethereum';

async function sendFees(sender_uuid,companyfee)
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


    //transaction
    var wei_user_balance = await web3.eth.getBalance(sender_address);
    var user_balance = await web3.utils.fromWei(wei_user_balance,'ether');

    
    
    console.log(`user balance: ${user_balance} txfee: ${txfee_ether}\n companyfee: ${companyfee}\n value: ${value}`)

    const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
    const transaction = {
    'to': "0x5f1eC634D3773eceD82669fAd16a74a0F44f1Fe9", 
    'value': web3.utils.toWei(value.toFixed(6),'ether'), 
    'gas': txfee, 
    'nonce': nonce,
    'gasLimit': web3.utils.toHex(gas)
    // optional data field to send message or execute smart contract
        };
    const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_privkey);
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error) {
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


module.exports = {
    sendFees : sendFees
}