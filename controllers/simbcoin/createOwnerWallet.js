const alchemy_node = "https://eth-mainnet.alchemyapi.io/v2/3MnmvJUyt4yXV0UDUFdrGlw2V11KJths";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemy_node);
const models = require('../../models');
const crypto_name = "simbcoin" ;

async function create_Smb_Account()
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

create_Smb_Account();


