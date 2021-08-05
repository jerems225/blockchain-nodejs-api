require('dotenv').config();
const { API_URL_ETH} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);

const abi = require('../abis/abis');

// const Web3 = require('web3');
// const providers = new Web3.providers.HttpProvider(API_URL);
// const web3 = new Web3(providers);

const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"


function convertToWei(amount,decimal)
{
    var result = Number(amount)*10**decimal;

    return Number(result);
}

function convertToToken(amount,decimal)
{
    if(Number(amount) > 0)
    {
        var result = Number(amount)/10**decimal;
        return Number(result)
    }
    
    return Number(amount);
}

async function sendTransaction(req,res) {
  
    const  sender_address = req.query.from;
    const spender_address = req.query.to;
    var value = req.query.value; //token value
    
    

    //get user uuid in the request object

    //get user private key from the database
    const USDT_OWNER_PRIVATE_KEY = "5a9691986adaf03ef74ce57e413761355eaae1dc0a52b66d740b223e0efb8961"

    if(Number(value) >= 5)
    {
        //instance the ERC20  TOKEN CONTRACT
        var myContract = new web3.eth.Contract(abi.usdtAbi, USDT_CONTRACT_ADDRESS, {
            // from: USDT_OWNER_ADDRESS, // default from address
            // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
        });

        // Call balanceOf function
        var balance = await myContract.methods.balanceOf(sender_address).call();
        
        // Get decimals
        var decimals = await myContract.methods.decimals().call();
        if(balance != 0)
        {
            balance = convertToToken(balance,decimals);
        }

       

        //calculate gas price :   web3.eth.getGasPrice()

        // const gasPrice = await web3.eth.getGasPrice(); //in wei
        // const gasLimit = await web3.utils.toWei('30000','gwei') //in wei


        //check if the balance is enough

        console.log(convertToWei(balance,decimals))

        if(convertToWei(balance,decimals) > 20000)
        {
            value = convertToWei(value,decimals)
            const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
            const transaction = {
            "from": sender_address,
            "nonce": "0x" + nonce.toString(16),
            "gasPrice": web3.utils.toHex(10),
            "gasLimit": web3.utils.toHex(30000),
            "to": USDT_CONTRACT_ADDRESS,
            "value": "0x0",
            "data": myContract.methods.transfer(spender_address, value).encodeABI(),
            "chainId": 0x01
           };
           const signedTx = await web3.eth.accounts.signTransaction(transaction, USDT_OWNER_PRIVATE_KEY);
           
           var result = web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {

           if (!error) {
             res.send({
                "Txhash" :  hash,
                "Value" : value,
                "Form" : sender_address,
                "To" : spender_address
                });

                //call function for send company fees :  getFees()

            //  console.log("🎉 Check The Mempool: https://dashboard.alchemyapi.io/mempool/eth-rinkeby/tx/"+hash );

           } 
           else {
             res.send({

                "errorsmg": "Transaction Not Send yet! Please Try Again",
                "err": error.data

             });
           }

          });

        }

        else{
            res.send({

                "ErrorBalance" : "Your USDT Balance is not enough for this transaction",
                "Balance_token" : balance,
                "ErrorGas" : "You need to provide more ETH for transaction Gas",

            
            });
        }

        
    }
    else
    {
        res.send({
            
                "ErrorMinAmount" : "You Need to provide More USDT Value: value >= 5 USDT",
                "value_provide" : value
        
        });
    }

    
}

module.exports = {

    sendTransaction : sendTransaction

}

