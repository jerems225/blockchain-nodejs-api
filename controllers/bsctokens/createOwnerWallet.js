require('dotenv').config();
const models = require('../../models');

async function create_token_Account(crypto_name)
{
    //create eth account
    const wallet = await models.ownerwallets.findOne({where:
    {
      crypto_name : "binance"
    }});
    const data = wallet.dataValues;
    const walletObject = {
        crypto_name : crypto_name,
        pubkey : data.pubkey,
        privkey : data.privkey,
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

module.exports = {
  create_token_Account
}


