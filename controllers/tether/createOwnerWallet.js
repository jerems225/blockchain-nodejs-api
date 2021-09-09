require('dotenv').config();
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const crypto_name = "tehter" ;

async function create_Usdt_Account()
{
  
    //create eth account
    var user_eth_account = await web3.eth.accounts.create();

    const walletObject = {
        crypto_name : crypto_name,
        pubkey : user_eth_account.address,
        privkey : user_eth_account.privateKey,
        mnemonic : "N/A",
    }
  
    //save in the database
    models.ownerwallets.create(walletObject).then(result => {
      console.log({
          status: 200,
          message: "Wallet created successfully",
          wallet : result
      });
      
    }).catch(error => {
      console.log({
          status : 500,
          message: "Something went wrong",
          error : error
      });
    });
  
  
}

create_Usdt_Account();


