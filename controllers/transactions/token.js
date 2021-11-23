async function send(res,uuid,value,txfee,txtype,crypto_name,momo_method,currency,country,status,rate)
{
    const sender_uuid = uuid;
    const transaction_type = txtype;
    var amount_min;
    var contract_address;
    var abi;

    const cryptoRequest = await models.Crypto.findOne({where:{
      crypto_name: crypto_name
    }})

    //crypto info
    const crypto = cryptoRequest.dataValues;
    var crypto_name_market = crypto.crypto_name_market;

    if(NODE_ENV == 'test' ||'development')
    {
      contract_address = crypto.contract_address_test;
      abi = crypto.contract_abi_test;
      amount_min = crypto.amoun_min;
    }
    else if(NODE_ENV == 'devprod' || 'production')
    {
      contract_address = crypto.contract_address;
      abi = crypto.contract_abi;
      amount_min = crypto.amoun_min;
    }

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : sender_uuid,
      crypto_name : crypto_name
    }})

    if(result)
    {
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

        var amount_usd;
        var amount_currency;
        var fees_usd;
        
        if(value >= amount_min)
        {
            //instance the ERC20  TOKEN CONTRACT
            var myContract = new web3.eth.Contract(abi, contract_address, {

            });

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
            var ether_fee = txfee;
            const ether_companyfee = null;

            //convert to usd 
            var urlusd=`https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=usd`; 
            var response_usd = await fetch(urlusd,{method: "GET"});
            var result_usd = await response_usd.json(); 
            var smb_price = result_usd[crypto_name_market].usd;
            amount_usd = smb_price*value;
            amount_currency = rate*amount_usd;

            const gas =  Number(ether_fee);
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
                            country : country,
                            paymentstatus: status,
                            from : sender_address,
                            to : spender_address,
                            confirmation: false,
                            user_uuid : sender_uuid
                        }
                            //save in the database
                        models.Transaction.create(txObj).then(result => {
    
                            txconfirmationController.get_eth_tx_confirmation(sender_uuid,ether_companyfee,transaction_type);
                            res.status(200).json({
                                status: 200,
                                message: `${crypto_name} sent to the user successfully`,
                                datas: result
                            });
                            
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
    send : send
}