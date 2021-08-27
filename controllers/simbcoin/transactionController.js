require('dotenv').config();
const { API_URL_ETH, PRIVATE_KEY_ETH } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);
const models = require('../../models');
const crypto_name = "simbcoin";
const abi = require('../abis/abis');

// const Web3 = require('web3');
// const providers = new Web3.providers.HttpProvider(API_URL);
// const web3 = new Web3(providers);

const SIMBCOIN_CONTRACT_ADDRESS = "0x53Bd789F2cDb846b227d8ffc7B46eD4263231FDf"


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
        const  sender_address = result.dataValues.pubkey;
        const  sender_pivkey = result.dataValues.privkey;
        const spender_address = req.query.to;
        const value = req.query.value; //token value
        

        //get user uuid in the request object

        //get user private key from the database
        const SIMBCOIN_OWNER_PRIVATE_KEY = "0x37ba72990057f161af1226d7ecafbb8bd330638e46e72f33a9108df60b5254a2"

        if(value >= 5)
        {
            //instance the ERC20  TOKEN CONTRACT
            var myContract = new web3.eth.Contract(abi.simbAbi, SIMBCOIN_CONTRACT_ADDRESS, {
                // from: SIMBCOIN_OWNER_ADDRESS, // default from address
                // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
            });

            // Call balanceOf function
            var balance = await myContract.methods.balanceOf(sender_address).call();
            
            // Get decimals
            var decimals = await myContract.methods.decimals().call();

            //get symbol
            var symbol = await myContract.methods.symbol().call()

            var balance_token = balance/10**decimals

            //calculate gas price :   web3.eth.getGasPrice()

            const gasPrice = await web3.eth.getGasPrice(); //in wei
            const gasLimit = await web3.utils.toWei('30000','gwei') //in wei

            const gas =  gasPrice;

            //check if the balance is enough

            if(balance > gas)
            {
                const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
                const transaction = {
                'to': spender_address, // user ethereum address
                'value': '0x', // value in eth
                'gas': 30000, 
                'nonce': nonce,
                'data' : myContract.methods.transfer( spender_address, web3.utils.toHex(web3.utils.toWei(value, "ether"))).encodeABI()
            };

            
            const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_pivkey);
            
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
                    res.status(200).json({
                        status: 200,
                        message: "Transaction created successfully",
                        datas: result
                    });
                    
                }).catch(error => {
                    res.status(500).json({
                        status : 500,
                        message: "Something went wrong",
                        error : error
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
                    message: `Your ${crypto_name} Balance is not enough for this transaction`,
                    data : {
                        gasError:  "You need to provide more Ether for transaction Gas",
                        balance: balance_token
                    }
                });
            }
        }
        else
        {
            res.status(500).json({
                status : 500,
                message: `You Need to provide More ${crypto_name} Value: value >= 5 ${crypto_name}`,
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

