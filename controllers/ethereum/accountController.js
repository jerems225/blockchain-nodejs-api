require('dotenv').config();
const { API_URL_ETH} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);

async function create_Eth_Account(req,res)
{
  var user_eth_account = await web3.eth.accounts.create();
  
  res.send({
      "wallet": user_eth_account
  });

  //save the new account in database by user uuid present in the request
  
}

async function get_Eth_Balance(req, res)
{
    //get user eth account address from database
    
    var address = req.params.address;
    
    var response = await web3.eth.getBalance(address);
    var balance = await web3.utils.fromWei(response,'ether');

    res.send({
       "balance" :  Number(balance)
    }) 
}







module.exports = {
    create_Eth_Account : create_Eth_Account,
    get_Eth_Balance : get_Eth_Balance
}