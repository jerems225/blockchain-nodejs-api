require('dotenv').config();
const { ETH_NODE_URL } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const crypto_name = "tether";
const abi = require('../abis/abis');
const txconfirmationController = require('./txconfirmationController');

const tokenaddress = require('../abis/tokenaddress');

const USDT_CONTRACT_ADDRESS = tokenaddress.usdtAddress;  // get env address

// const USDT_CONTRACT_ADDRESS = "0xFab46E002BbF0b4509813474841E0716E6730136"  //faucet token address

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
        var value = req.query.value; //token value


        if(value >= 5)
        {
            //instance the ERC20  TOKEN CONTRACT
            var myContract = new web3.eth.Contract(abi.fauAbi, USDT_CONTRACT_ADDRESS, {
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

                value = ""+value*10**decimals;

                const transaction = {
                    "from":sender_address,
                     "gasPrice": web3.utils.toHex(2 * 1e9),
                     "gasLimit": web3.utils.toHex(210000),
                     "to":USDT_CONTRACT_ADDRESS,
                     "value":"0x0",
                     "data":myContract.methods.transfer(spender_address, value).encodeABI(),
                     "nonce":web3.utils.toHex(nonce)
                 };

            
            const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_pivkey);
            
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {

            if (!error) {
        
                const txObj = {
                    crypto_name: crypto_name,
                    transaction_type: transaction_type,
                    hash :  hash,
                    amount : value,
                    fees: 21000,
                    from : sender_address,
                    to : spender_address,
                    confirmation: false,
                    user_uuid : sender_uuid
                }
                
                    //save in the database
                models.Transaction.create(txObj).then(result => {

                    txconfirmationController.get_usdt_tx_confirmation(sender_uuid);
                    res.status(201).json({
                        status: 201,
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
                message: `You Need to provide More ${symbol} Value: value >= 5 ${symbol}`,
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

