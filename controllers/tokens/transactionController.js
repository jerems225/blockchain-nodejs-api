require('dotenv').config();
const { ETH_NODE_URL } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const txconfirmationController = require('../ethereum/txconfirmationController');

async function sendTransaction(req,res) {

    const sender_uuid = req.query.uuid;
    const transaction_type = req.params.txtype;
    const crypto_symbol = req.params.token_symbol;
    var crypto_name;
    var contract_address;
    var abi;

    const cryptoRequest = await models.Crypto.findOne({where:{
      crypto_symbol: crypto_symbol
    }})

    //crypto info
    const crypto = cryptoRequest.dataValues;
    var crypto_name_market = crypto.crypto_name_market;
    const amount_min = crypto.amount_min;

    if(NODE_ENV == 'test' ||'development')
    {
      crypto_name = crypto.crypto_name;
      contract_address = crypto.contract_address_test;
      abi = crypto.contract_abi_test;
    }
    else if(NODE_ENV == 'devprod' || 'production')
    {
      crypto_name = crypto.crypto_name;
      contract_address = crypto.contract_address;
      abi = crypto.contract_abi;
    }

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : sender_uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
        const  sender_address = result.dataValues.pubkey;
        const  sender_privkey = result.dataValues.privkey;
        const spender_address = req.query.to;
        var value = req.query.value; //token value
        var momo_method;
        var currency;
        var amount_usd;
        var amount_currency;
        var fees_usd;
        var country;
        var rate;

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
                const rateResponse = models.rate.findOne({where: {
                    currency: currency
                }})
                rate = rateResponse.dataValues.value_sell;
            }
        }
        
        if(value >= amount_min)
        {
            //instance the ERC20  TOKEN CONTRACT
            var myContract = new web3.eth.Contract(abi, contract_address, {});

            // Call balanceOf function
            var balance = await myContract.methods.balanceOf(sender_address).call();
            
            // Get decimals
            var decimals = await myContract.methods.decimals().call();

            //get symbol
            var symbol = await myContract.methods.symbol().call()

            var balance_token = 0;
            if(balance > 0)
            {
                balance_token = balance/10**decimals;
            }
           
            //fees
            //get tx_fee
            var ether_fee = req.query.txfee;
            //get company_fee and convert in eth
            var smb_companyfee = Number(req.query.companyfee);
            //convert to eth
            var ether_companyfee = 0;
            var url=`https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=eth`; 
            var response_smb = await fetch(url,{method: "GET"});
            var result_smb = await response_smb.json(); 
            var eth_price = result_smb[crypto_name_market].eth;
            ether_companyfee = smb_companyfee * eth_price;

            //convert to usd 
            var urlusd=`https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=usd`; 
            var response_usd = await fetch(urlusd,{method: "GET"});
            var result_usd = await response_usd.json(); 
            var smb_price = result_usd[crypto_name_market].usd;
            amount_usd = smb_price*value;
            if(transaction_type == "withdraw")
            {
              amount_currency = rate*amount_usd;
            }

            const gas =  Number(ether_fee) + Number(ether_companyfee);
            fees_usd = usdt_price*gas;

            const user_eth_balance = await web3.utils.fromWei(web3.eth.getBalance(sender_address),'ether');
            
            //check if the balance is enough

            if(balance >= value)
            {
                if(user_eth_balance >= gas)
                {
                    const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
                    value = ""+value*10**decimals;
                    const transaction = {
                        "from":sender_address,
                         "gasPrice": web3.utils.toHex(2 * 1e9),
                         "gasLimit": web3.utils.toHex(21000),
                         "gas": web3.utils.hex(web3.utils.fromWei(web3.utils.toWei(ether_fee,'ether'),'gwei')),
                         "to":contract_address,
                         "value":"0x0",
                         "data":myContract.methods.transfer(spender_address, value).encodeABI(),
                         "nonce":web3.utils.toHex(nonce)
                     };
                    const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_privkey);
                    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
                    if (!error)
                    {
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
                            from : sender_address,
                            to : spender_address,
                            confirmation: false,
                            user_uuid : sender_uuid
                        }
                            //save in the database
                        models.Transaction.create(txObj).then(result => {
    
                            txconfirmationController.get_eth_tx_confirmation(sender_uuid,ether_companyfee,transaction_type);
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
                                error : error
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
                    //endifsendtransaction
                    });
                }
                //endifbalanceeth
                else
                {
                    res.status(401).json({
                        status : 401,
                        message: `Your ethereum Balance is not enough for this transaction`,
                        data : {
                            error:  "You need to provide more Ether for transaction fees",
                            balance: user_eth_balance
                        }
                    });
                }
            }
            //endifbalancesmb
            else{
                res.status(401).json({
                    status : 401,
                    message: `Your ${crypto_name} Balance is not enough for this transaction`,
                    data : {
                        gasError:  "You need to provide more Ether for transaction Gas",
                        balance: balance_token
                    }
                });
            }
        }
        //endif min value
        else
        {
            res.status(500).json({
                status : 500,
                message: `You Need to provide More ${symbol} Value: value >= ${amount_min} ${symbol}`,
                data : {
                   amount : value
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

    sendTransaction : sendTransaction

}

