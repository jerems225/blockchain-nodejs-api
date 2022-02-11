require('dotenv').config();
const { ETH_NODE_URL } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const crypto_name = "ethereum" ;

async function create_Eth_Account(req,res)
{
  const owner_uuid = req.query.uuid;


  //verification if uuid is exist and valid before run code
  const user = await models.user.findOne({ where : 
    {
      uuid : owner_uuid,
    }})
 const result = await models.Wallet.findOne({ where : 
  {
    user_uuid : owner_uuid,
    crypto_name : crypto_name
  }})

  if(user)
  {
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
  else
  {
      res.status(401).json({
        status : 401,
        message: `Unknown User`
    });
  }
}

async function create_owner_Eth_Account(req,res)
{
    const owner_uuid = req.params.uuid;


    //verification if uuid is exist and valid before run code
    const user = await models.user.findOne({ where : 
      {
        uuid : owner_uuid,
      }})
    if(user)
    {
      const result = await models.ownerstakewallet.findOne({ where : 
        {
          crypto_name : crypto_name
        }})
    
        if(user.dataValues.roles[0] == "ROLE_ADMIN")
        {
            if(result)
            {
              res.status(401).json({
                status : 401,
                message: `This asset already have as ${crypto_name} stake owner account`
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
                  mnemonic : "N/A"
              }
              //save in the database
              models.ownerstakewallet.create(walletObject).then(result => {
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
        else
        {
            res.status(401).json({
              status : 401,
              message: `UnAuthorized User`
          });
        }
    }else
    {
        res.status(401).json({
          status : 401,
          message: `Unknown User`
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
      var bal = await web3.utils.fromWei(response,'ether');
      var balance = "0.0";

        if(bal != 0)
        {
          balance = bal
        }

      res.status(200).json({
        status : 200,
        message: `${crypto_name} account balance for this user`,
        balance : Number.parseFloat(balance).toPrecision()
      });
      }
}



module.exports = {
    create_Eth_Account : create_Eth_Account,
    get_Eth_Balance : get_Eth_Balance,
    get_Eth_Address : get_Eth_Address,
    create_owner_Eth_Account : create_owner_Eth_Account,
}