require('dotenv').config();
const fetch = require('node-fetch');
const { ETH_NODE_URL,GETBLOCK_APIKEY,GETBLOCK_NETWORK } = require('../../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../../models');
const txconfirmationController = require('../../ethereum/txconfirmationController');

async function send(res,uuid,value,txfee,txtype,crypto_name,momo_method,currency,country,status,rate)
{
    const sender_uuid = uuid;
    const transaction_type = txtype;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where :
    {
      user_uuid : sender_uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
        //get from database
        const  spender_address = result.dataValues.pubkey;

        //get owner wallet
        const ownerwallet = await models.ownerwallets.findOne({where:
            {
                crypto_name : crypto_name
            }
        });
        var owner = ownerwallet.dataValues;
        const sender_address = owner.pubkey;
        const  sender_privkey = owner.privkey;

        const cryptoRequest = await models.Crypto.findOne({where:{
            crypto_name: crypto_name
        }})
  
        //crypto info
        const crypto = cryptoRequest.dataValues;
        const amount_min = crypto.amount_min;

        if(value >= amount_min)
        {
            var gasLimit = 21000;
            var ether_fee = txfee;

            var gas = Number(ether_fee);
            var ether_companyfee = null;

            //get ether user balance
            var wei_user_balance = await web3.eth.getBalance(sender_address);
            var user_balance = await web3.utils.fromWei(wei_user_balance,'ether');


            var gwei_fee = await web3.utils.fromWei(web3.utils.toWei(ether_fee,'ether'),'gwei');
            const check_available_amount = Number(ether_fee) ;

            //convert value ether to usd
            var urleth="https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"; 
            var response_eth = await fetch(urleth,{method: "GET"});
            var result_eth = await response_eth.json();
            amount_usd = result_eth.ethereum.usd*value;
            fees_usd = result_eth.ethereum.usd*gas;
            amount_currency = rate*amount_usd;


            if(user_balance > check_available_amount)
            {
                const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
                const transaction = { 
                'to': spender_address, // user ethereum address
                'value': web3.utils.toWei(value,'ether'), // value in eth
                'gas': gwei_fee, 
                'nonce': nonce,
                'gasLimit': web3.utils.toHex(gasLimit),
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
                    fees: gas,
                    amount_usd: amount_usd,
                    fees_usd: fees_usd,
                    amountcurrency: amount_currency,
                    currency: currency,
                    country: country,
                    momo_method: momo_method,
                    paymentstatus: status,
                    from : sender_address,
                    to : spender_address,
                    confirmation: false,
                    user_uuid : sender_uuid
                }
                //save in the database
                models.Transaction.create(txObj).then(result => {
                    txconfirmationController.get_eth_tx_confirmation(sender_uuid,ether_companyfee,transaction_type); //confirmation tx function
                    res.status(200).json({
                        status: 200,
                        message: `${crypto_name} sent to the user successfully`,
                        datas: result
                    });
                    process.exit();
                    
                }).catch(error => {
                    res.status(500).json({
                        status : 500,
                        message: "Something went wrong",
                        data: {
                            error : error
                        } 
                    });
                });
            } 
            else {
                res.status(500).json({
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
                res.status(401).json({
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
            res.status(401).json({
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
        res.status(401).json({
            status : 401,
            message: `Unknown User`
        });
    }
}

module.exports = {
    send : send
}