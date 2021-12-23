require('dotenv').config();
const fetch = require('node-fetch');
const { ETH_NODE_URL,GETBLOCK_APIKEY,GETBLOCK_NETWORK } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const txconfirmationController = require('./txconfirmationController');
const crypto_name = "ethereum" ;


async function estimategas(req,res)
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
        // const  sender_address = result.dataValues.pubkey;
        // const  spender_address = req.query.to;
        // const  value = req.query.value;
        // const fees_type = req.query.fees_type;

        var urlgasp = "https://ethgasstation.info/api/ethgasAPI.json?";
        var  resp = await fetch(urlgasp,{
            method: "GET"
        });

        var resjson = await resp.json()
        var gas = 21000;

        var fast = await web3.utils.fromWei(web3.utils.toWei((gas*(resjson.fast/10)).toString(),'gwei'),'ether');
        var fastest = await web3.utils.fromWei(web3.utils.toWei((gas*(resjson.fastest/10)).toString(),'gwei'),'ether');
        var average = await web3.utils.fromWei(web3.utils.toWei((gas*(resjson.average/10)).toString(),'gwei'),'ether');
        var safelow = await web3.utils.fromWei(web3.utils.toWei((gas*(resjson.safeLow/10)).toString(),'gwei'),'ether');

        var gasStatistic = {
            "fastplus" : Number(fastest),
            "fast": Number(fast),
            "medium": Number(average), 
            "normal": Number(safelow)
        }
        
        res.status(200).json({
            status : 200,
            message: "Fees Managment Get With Success",
            data : gasStatistic
        });
    }
    else{
        res.status(401).json({
            status : 401,
            message: "Unknown User",
            data : null
        });
    }
}

async function sendTransaction(req,res) {
  
    const sender_uuid = req.query.uuid;
    const transaction_type = req.params.txtype;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where :
    {
      user_uuid : sender_uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
        //get from database
        const  sender_address = result.dataValues.pubkey;
        const  sender_privkey = result.dataValues.privkey;
        var spender_address;
        var momo_method;
        var currency;
        var amount_usd;
        var amount_currency;
        var fees_usd;
        var rate;
        var country;
        var phone;
        const value = req.query.value;

        //get owner wallet
        const ownerwallet = await models.ownerwallets.findOne({where:
            {
                crypto_name : crypto_name
            }
        });
        
        if(transaction_type == "send")
        {
            spender_address = req.query.to; //spender address
        }
        else
        {
            if(transaction_type == "withdraw")
            {
                spender_address = ownerwallet.dataValues.pubkey; //owner wallet address
                momo_method = req.query.momo_method;
                currency = req.query.currency;
                country = req.query.country;
                phone = req.query.phone;
                const rateResponse = await models.rate.findOne({where: {
                    currency: currency
                }})
                rate = rateResponse.dataValues.value_sell;
            }
        }

        const cryptoRequest = await models.Crypto.findOne({where:{
            crypto_name: crypto_name
        }})
  
        //crypto info
        const crypto = cryptoRequest.dataValues;
        const amount_min = crypto.amount_min;

        if(value >= amount_min)
        {
            var gasLimit = 21000;
            var ether_fee = req.query.txfee;
            var ether_companyfee = req.query.companyfee;

            var gas = Number(ether_fee) + Number(ether_companyfee);
            

            //get ether user balance
            var wei_user_balance = await web3.eth.getBalance(sender_address);
            var user_balance = await web3.utils.fromWei(wei_user_balance,'ether');


            var gwei_fee = await web3.utils.fromWei(await web3.utils.toWei(ether_fee,'ether'),'gwei');
            const check_available_amount = Number(ether_fee) + Number(ether_companyfee) + Number(value);

            //convert value ether to usd
            var urleth="https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"; 
            var response_eth = await fetch(urleth,{method: "GET"});
            var result_eth = await response_eth.json(); 
            amount_usd = result_eth.ethereum.usd*value;
            fees_usd = result_eth.ethereum.usd*gas;
            if(transaction_type == "withdraw")
            {
              amount_currency = rate*amount_usd;
            }

            if(user_balance >= check_available_amount)
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
                    momo_method: momo_method,
                    country: country,
                    phone : phone,
                    from : sender_address,
                    to : spender_address,
                    confirmation: false,
                    user_uuid : sender_uuid
                }
                //save in the database
                models.Transaction.create(txObj).then(result => {
                    txconfirmationController.get_eth_tx_confirmation(sender_uuid,ether_companyfee,transaction_type); //confirmation tx function
                    if(transaction_type == "send" || transaction_type == "withdraw")
                    {
                        res.status(200).json({
                            status : 200,
                            message: `Transaction created successfully`,
                            data : result
                        });
                    }
                    
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
    sendTransaction : sendTransaction,
    estimategas : estimategas
}

