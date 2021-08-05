require('dotenv').config();
const { API_URL_ETH, PRIVATE_KEY_ETH } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);

// const Web3 = require('web3');
// const providers = new Web3.providers.HttpProvider(API_URL);
// const web3 = new Web3(providers);
   

async function sendTransaction(req,res) {
  
    const  sender_address = req.query.from;
    const spender_address = req.query.to;
    const value = req.query.value;
    

    //get user uuid in the request object

    //get user private key from the database


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

        const gas = gwei_value + 21000 * 21;

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

          
           const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY_ETH);
           
           web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {

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
                "err": error

             });
           }

          });
        }

        else{
            res.send({

                "Errormsg" : "Your Balance is not enough for this transaction",
                "Balance" : ether_user_balance
            
            });
        }

        
    }
    else
    {
        res.send({
            
                "ErrorMinAmount" : "You Need to provide More Ether Value: value >= 0.001 Eth",
                "value_provide" : value
        
        });
    }

    
}

module.exports = {

    sendTransaction : sendTransaction

}

