require('dotenv').config();
const { API_URL_ETH} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);
const models = require('../../models');
const crypto_name = "ethereum" ;

async function create_Eth_Account(req,res)
{
  const owner_uuid = req.query.uuid;


  //verification if uuid is exist and valid before run code
 const result = await models.Wallet.findOne({ where : 
  {
    user_uuid : owner_uuid,
    crypto_name : crypto_name
  }})

  if(result)
  {
    res.status(401).json({
      status : 401,
      message: `This user already have a ${crypto_name} account`
  });
  }
  else
  {
    //create eth account
    var user_eth_account = await web3.eth.accounts.create();

    const walletObject = {
        crypto_name : crypto_name,
        pubkey : user_eth_account.address,
        privkey : user_eth_account.privateKey,
        mnemonic : "N/A",
        user_uuid : owner_uuid
    }
  
    //save in the database
    models.Wallet.create(walletObject).then(result => {
      res.status(200).json({
          status: 200,
          message: "Wallet created successfully",
          wallet : result
      });
      
    }).catch(error => {
      res.status(500).json({
          status : 500,
          message: "Something went wrong",
          error : error
      });
    });
  }
  
}

async function get_Eth_Address(req,res)
{
    const owner_uuid = req.query.uuid;
    //verification if uuid is exist and valid before run code
  const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : owner_uuid,
      crypto_name : crypto_name
    }})

    if(!result)
    {
      res.status(401).json({
        status : 401,
        message: `Unknown User`
    });
    }
    else
    {
    
      //save in the database
     
        res.status(200).json({
            status: 200,
            address : result.dataValues.pubkey
        });
      }
}

async function get_Eth_Balance(req, res)
{
    //get user eth account address from database
    
    const owner_uuid = req.params.uuid;
    let address;

      const result = await models.Wallet.findOne({ where : 
      {
        user_uuid : owner_uuid,
        crypto_name : crypto_name
      }});

      if(!result)
      {
        res.status(401).json({
          status : 401,
          message: `Unknown ${crypto_name} account for this user`
        });
      }
      else
      {
        address = result.dataValues.pubkey;
        var response = await web3.eth.getBalance(address);
      var balance = await web3.utils.fromWei(response,'ether');

      res.send({
        "balance" :  Number(balance)
      }) ;
      }
}



module.exports = {
    create_Eth_Account : create_Eth_Account,
    get_Eth_Balance : get_Eth_Balance,
    get_Eth_Address : get_Eth_Address,
}