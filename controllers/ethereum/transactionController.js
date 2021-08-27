require('dotenv').config();
const { API_URL_ETH, PRIVATE_KEY_ETH } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);
const models = require('../../models');
const txconfirmationController = require('./txconfirmationController');
const crypto_name = "ethereum" ;

// const Web3 = require('web3');
// const providers = new Web3.providers.HttpProvider(API_URL);
// const web3 = new Web3(providers);
   

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

        const spender_address = req.query.to;
        const value = req.query.value;


        const wei_value = await web3.utils.toWei(value,'ether');// convert value in gwei
        const gwei_value = await web3.utils.fromWei(wei_value,'gwei');// convert value in ether

        const user_balance = await web3.eth.getBalance(sender_address); // balance in wei

        const gwei_user_balance = await web3.utils.fromWei(user_balance,'gwei'); // balance in gwei
        const ether_user_balance = await web3.utils.fromWei(user_balance,'ether'); //balance in ether
        

        if(value >= 0.001)
        {

            //calculate gas price :   web3.eth.getGasPrice()

            const gasRequest = await web3.eth.getGasPrice(); //in wei

            //gas price in gwei
            const gasPriceGwei = await web3.utils.fromWei(gasRequest,'gwei');
            const gasPrice = 21000 * gasPriceGwei;

            //check if the balance is enough

            const gas = 1;

            if(gwei_user_balance > gas)
            {
                const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
                const transaction = {
                'to': spender_address, // user ethereum address
                'value': web3.utils.toWei(value,'ether'), // value in eth
                'gas': 21000, 
                'nonce': nonce,
                'gasLimit': web3.utils.toHex(21000),
                'gasPrice': web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
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
                    from : sender_address,
                    to : spender_address,
                    confirmation: false,
                    user_uuid : sender_uuid
                }
                
                    //save in the database
                models.Transaction.create(txObj).then(result => {

                    txconfirmationController.get_eth_tx_confirmation(sender_uuid);

                    res.status(200).json({
                        status : 200,
                        message: `Transaction created successfully`,
                        data : result
                    });
                    
                }).catch(error => {
                    res.status(500).json({
                        status : 500,
                        message: "Something went wrong",
                        data: {
                            error : error
                        } 
                    });
                });
                 //call function for send company fees :  getFees()
                //  console.log("🎉 Check The Mempool: https://dashboard.alchemyapi.io/mempool/eth-rinkeby/tx/"+hash );

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
                        Balance: ether_user_balance
                    }
                });
            }

        }
        else
        {
            res.status(401).json({
                status : 401,
                message: "You Need to provide More Ether Value: value >= 0.001 Eth",
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

    sendTransaction : sendTransaction

}

