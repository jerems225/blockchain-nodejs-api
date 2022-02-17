require('dotenv').config();
const fetch = require('node-fetch');
const { NODE_ENV} = process.env;
const { BSC_NODE_URL,GETBLOCK_APIKEY,GETBLOCK_NETWORK, CHAIN_ID } = require('../../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(BSC_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../../models');
const txconfirmationController = require('../../binance/txconfirmationController');

async function send(stakeobject,tx_info,day)
{

    const uuid = stakeobject.user_uuid;
    const value = stakeobject.amount_invest;
    const crypto_name = stakeobject.crypto_name;
    const spender_address = tx_info.owner_address;
    const sender_address = tx_info.user_address;

    const sender_privkey = tx_info.user_privkey;
    
    console.log("sender: "+sender_address, "sender_priv_Key: "+sender_privkey)
    console.log("receiver: "+spender_address);



    const fee = stakeobject.fee_start;
    const transaction_type = "staking";

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where :
    {
      user_uuid : uuid,
      crypto_name : crypto_name
    }});

    if(result)
    {
        process.exit();
        const cryptoRequest = await models.Crypto.findOne({where:{
            crypto_name: crypto_name
        }})
  
        //crypto info
        const crypto = cryptoRequest.dataValues;
        const amount_min = crypto.amount_min;
        if(value >= amount_min)
        {
            var gasLimit = 21000;
            var gas = fee;
            var ether_companyfee = null;

            //get ether user balance
            var wei_user_balance = await web3.eth.getBalance(sender_address);
            var user_balance = await web3.utils.fromWei(wei_user_balance,'ether');
            


            var gwei_fee = await web3.utils.fromWei(await web3.utils.toWei(fee.toString(),'ether'),'gwei');
            const check_available_amount = Number(fee) ;

            //convert value ether to usd
            var urleth="https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"; 
            var response_eth = await fetch(urleth,{method: "GET"});
            var result_eth = await response_eth.json();
            var amount_usd = result_eth.binancecoin.usd*value;
            var fees_usd = result_eth.binancecoin.usd*gas;


            if(user_balance > check_available_amount)
            {
                const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
                const transaction = { 
                'to': spender_address, // user ethereum address
                'value': web3.utils.toWei(value.toString(),'ether'), // value in eth
                'gas': gwei_fee, 
                'nonce': nonce,
                'gasLimit': web3.utils.toHex(gasLimit),
                'chainId': CHAIN_ID
                // optional data field to send message or execute smart contract

            };
            const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_privkey);
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
            if (!error) {
                const txObj = {
                    crypto_name: crypto_name,
                    transaction_type: transaction_type,
                    hash :  hash,
                    amount : value,
                    fees: fee,
                    amount_usd: amount_usd,
                    fees_usd: fees_usd,
                    amountcurrency: null,
                    currency: null,
                    momo_method: null,
                    country : null,
                    paymentstatus: false,
                    from : sender_address,
                    to : spender_address,
                    confirmation: false,
                    user_uuid : uuid
                }
                //save in the database
                models.Transaction.create(txObj).then(result => {
                    
                    txconfirmationController.get_bsc_tx_confirmation(stakeobject.user_uuid,ether_companyfee,transaction_type,day); //confirmation tx function
                    console.log({
                        status: 200,
                        message: `${crypto_name} sent to the staking pool successfully`,
                        datas: result
                    });
                    // process.exit();
                    
                }).catch(error => {
                    console.log({
                        status : 500,
                        message: "Something went wrong",
                        data: {
                            error : error
                        } 
                    });
                });
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
            else{
                console.log({
                    status : 401,
                    message: "Your Balance is not enough for this transaction",
                    data : {
                        Balance: user_balance
                    }
                });
            }

        }
        else
        {
            console.log({
                status : 401,
                message: `You Need to provide More ${crypto_name} Value: value >= ${amount_min} ${crypto_name}`,
                data : {
                    amount: value
                }
            });
        }
    }
    else
    {
        console.log({
            status : 401,
            message: `Unknown User`
        });
    }
}

module.exports = {
    send : send
}