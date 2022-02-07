require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const { ETH_NODE_URL } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');


async function createTokenAccount(req,res)
{
    const owner_uuid = req.query.uuid;
    const crypto_symbol = req.params.token_symbol;

    const cryptoRequest = await models.Crypto.findOne({where:{
      crypto_symbol: crypto_symbol
    }})
    const crypto_name = cryptoRequest.dataValues.crypto_name;
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
          var account = await models.Wallet.findOne({ where : 
            {
              user_uuid : owner_uuid,
              crypto_name : "ethereum"
            }})

          const walletObject = {
              crypto_name : crypto_name,
              pubkey : account.dataValues.pubkey,
              privkey : account.dataValues.privkey,
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
    //save account in the database
}

async function create_owner_TokenAccount(req,res)
{
    const owner_uuid = req.params.uuid;
    const name = req.params.name;

    const user = await models.user.findOne({where : {
      uuid: owner_uuid
    }})

    const result = await models.ownerstakewallet.findOne({ where : 
    {
      crypto_name : name
    }})

    if(user)
    {
      if(user.dataValues.roles[0] == "ROLE_ADMIN")
      {
        if(result)
        {
          res.status(401).json({
            status : 401,
            message: `This asset already have as ${name} stake owner account`
        });
        }
        else
        {
          //create eth account
          var account = await models.ownerstakewallet.findOne({ where : 
            {
              crypto_name : "ethereum"
            }})

          const walletObject = {
              crypto_name : name,
              pubkey : account.dataValues.pubkey,
              privkey : account.dataValues.privkey,
              mnemonic : "N/A",
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
      }else
      {
          res.status(401).json({
            status : 401,
            message: `UnAuthorized User`
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
    //save account in the database
}

async function get_token_Address(req,res)
{
    const owner_uuid = req.query.uuid;
    const crypto_symbol = req.params.token_symbol;

    const cryptoRequest = await models.Crypto.findOne({where:{
      crypto_symbol: crypto_symbol
    }})
    const crypto_name = cryptoRequest.dataValues.crypto_name;
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

async function get_token_balance(req,res)
{
    const owner_uuid = req.params.uuid;
    const crypto_symbol = req.params.token_symbol;
    let address;
    var crypto_name;
    var contract_address;
    var abi;

    const cryptoRequest = await models.Crypto.findOne({where:{
      crypto_symbol: crypto_symbol
    }})

    //crypto info
    const crypto = cryptoRequest.dataValues;

    if(NODE_ENV == 'test' || NODE_ENV == 'development')
    {
      crypto_name = crypto.crypto_name;
      contract_address = crypto.contract_address_test;
      abi = crypto.contract_abi_test;
    }
    else if(NODE_ENV == 'devprod' || NODE_ENV == 'production' )
    {
      crypto_name = crypto.crypto_name;
      contract_address = crypto.contract_address;
      abi = crypto.contract_abi;
    }

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
        var myContract = new web3.eth.Contract(abi, contract_address);
    
        // Call balanceOf function
        var balance = await myContract.methods.balanceOf(address).call();
        // Get decimals
        var decimals = await myContract.methods.decimals().call();

        //get symbol
        var symbol = await myContract.methods.symbol().call()

        if(balance != 0)
        {
            balance = balance/(10**decimals);
        }
        else
        {
          balance = 0;
        }

        res.status(200).json({
          status : 200,
          message: `${crypto_name} account balance for this user`,
          balance : Number.parseFloat(balance).toPrecision(),
          symbol: symbol
        });
      }



    
}


//get user simbcoin account address from database

module.exports = {
    createTokenAccount : createTokenAccount,
    get_token_balance : get_token_balance,
    get_token_Address : get_token_Address,
    create_owner_TokenAccount : create_owner_TokenAccount
}